import pandas as pd
import json
from pathlib import Path
import re
import unicodedata
from difflib import SequenceMatcher


IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
DEFAULT_IMAGE = '/arroz.jpeg'

# Overrides for products that must use a specific image regardless of fuzzy score.
IMAGE_OVERRIDES = {
    'farofa-fina-c-pimenta': '/images/produtosnaturais/farofa.jpg',
}


def normalize_text(value):
    """Normalize text to improve fuzzy matching between product names and image files."""
    if value is None:
        return ''
    text = str(value).strip().lower()
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace('&', ' e ')
    text = re.sub(r'[^a-z0-9]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def tokenize(value):
    return [part for part in normalize_text(value).split(' ') if part]


def build_image_index(images_root):
    """Create an index of available images grouped by category folder."""
    index = {}
    if not images_root.exists():
        return index

    for category_dir in images_root.iterdir():
        if not category_dir.is_dir():
            continue

        category_key = normalize_text(category_dir.name)
        if not category_key:
            continue

        files = []
        for image_file in category_dir.iterdir():
            if image_file.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            stem_norm = normalize_text(image_file.stem)
            if not stem_norm:
                continue
            files.append(
                {
                    'file_name': image_file.name,
                    'stem_norm': stem_norm,
                    'tokens': set(tokenize(image_file.stem)),
                    'public_path': f'/images/{category_dir.name}/{image_file.name}'
                }
            )

        index[category_key] = files

    return index


def score_candidate(product_tokens, stem_norm, product_norm, candidate):
    """Score candidate image for a product. Higher is better."""
    score = 0.0

    if candidate['stem_norm'] == product_norm:
        score += 1.0

    stem_tokens = candidate['tokens']
    if product_tokens and stem_tokens:
        overlap = product_tokens.intersection(stem_tokens)
        score += (2.2 * len(overlap)) / max(len(product_tokens), 1)

        if product_tokens.issubset(stem_tokens):
            score += 0.8
        if stem_tokens.issubset(product_tokens):
            score += 0.5

    score += SequenceMatcher(None, product_norm,
                             candidate['stem_norm']).ratio()
    score += 0.4 * SequenceMatcher(None, stem_norm,
                                   candidate['stem_norm']).ratio()

    return score


def find_best_image(product_id, descricao, categoria, image_index):
    """Find best image match for product using category folder and fuzzy matching."""
    product_id_key = str(product_id).strip().lower()
    if product_id_key in IMAGE_OVERRIDES:
        override_path = IMAGE_OVERRIDES[product_id_key]
        return override_path, {
            'status': 'override',
            'score': 999.0,
            'matched': Path(override_path).name,
        }

    category_key = normalize_text(categoria)
    candidates = image_index.get(category_key, [])
    if not candidates:
        return DEFAULT_IMAGE, {'status': 'no-category-folder', 'score': 0.0, 'matched': None}

    product_norm = normalize_text(descricao)
    id_norm = normalize_text(product_id)
    product_tokens = set(tokenize(descricao))
    product_tokens.update(tokenize(product_id))

    best = None
    best_score = -1.0
    for candidate in candidates:
        score = score_candidate(product_tokens, id_norm,
                                product_norm, candidate)
        if score > best_score:
            best = candidate
            best_score = score

    min_score = 1.75
    if best is None or best_score < min_score:
        return DEFAULT_IMAGE, {
            'status': 'no-match',
            'score': round(best_score, 4),
            'matched': best['file_name'] if best else None,
        }

    return best['public_path'], {
        'status': 'matched',
        'score': round(best_score, 4),
        'matched': best['file_name'],
    }


def is_promo_category(category_name):
    category_norm = normalize_text(category_name)
    return category_norm in {'promocao', 'promocoes'}


def load_existing_image_map(produtos_json_path):
    """Load current product images so converter keeps them fixed across executions."""
    if not produtos_json_path.exists():
        return {}

    try:
        with open(produtos_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError):
        return {}

    image_map = {}
    for categoria, products in data.items():
        if not isinstance(products, list):
            continue

        categoria_key = normalize_text(categoria)
        for product in products:
            product_id = str(product.get('id', '')).strip()
            image_path = str(product.get('imagem', '')).strip()
            if not product_id or not image_path:
                continue

            image_map[(categoria_key, normalize_text(product_id))] = image_path

    return image_map


def resolve_fixed_image(product_id, categoria, existing_image_map):
    """Keep current image from produtos.json. New items get default image."""
    category_key = normalize_text(categoria)
    product_key = normalize_text(product_id)
    image_path = existing_image_map.get((category_key, product_key))
    if image_path:
        return image_path, {'status': 'fixed-existing', 'score': 999.0, 'matched': Path(image_path).name}

    return DEFAULT_IMAGE, {'status': 'manual-default', 'score': 0.0, 'matched': None}


def sync_promo_images_by_id(resultado, report):
    """Make promo items reuse the image from the same id in non-promo categories."""
    image_by_id = {}

    for category_name, products in resultado.items():
        if is_promo_category(category_name) or not isinstance(products, list):
            continue

        for product in products:
            product_id = str(product.get('id', '')).strip()
            image_path = str(product.get('imagem', '')).strip()
            if not product_id or not image_path or image_path == DEFAULT_IMAGE:
                continue
            image_by_id.setdefault(product_id, image_path)

    detail_index = {
        (detail.get('categoria'), detail.get('id')): detail
        for detail in report.get('details', [])
    }

    for category_name, products in resultado.items():
        if not is_promo_category(category_name) or not isinstance(products, list):
            continue

        for product in products:
            product_id = str(product.get('id', '')).strip()
            inherited_image = image_by_id.get(product_id)
            if not inherited_image:
                continue

            previous_image = str(product.get('imagem', '')).strip()
            product['imagem'] = inherited_image

            detail = detail_index.get((category_name, product_id))
            if not detail:
                continue

            previous_status = detail.get('status')
            detail['imagem'] = inherited_image
            detail['status'] = 'linked-by-id'
            detail['score'] = 999.0
            detail['arquivo_sugerido'] = Path(inherited_image).name

            if previous_status not in {'matched', 'override', 'linked-by-id'}:
                report['summary']['matched'] += 1
                report['summary']['fallback'] = max(
                    0, report['summary']['fallback'] - 1)
                if previous_status == 'no-category-folder':
                    report['summary']['category_without_folder'] = max(
                        0, report['summary']['category_without_folder'] - 1)


def converter_xlsx_para_json():
    """Converte o XLSX formatado para JSON estruturado para React"""

    base_dir = Path(__file__).resolve().parents[1]
    data_dir = base_dir / 'data'

    # Procurar um arquivo XLSX plausível na pasta `data`.
    # Prioriza nomes que começam com 'ProdutosFomatodos', senão pega o primeiro .xlsx disponível.
    xlsx_path = None
    candidates = list(data_dir.glob('*.xlsx'))
    if not candidates:
        raise FileNotFoundError(
            f'Nenhum arquivo XLSX encontrado na pasta: {data_dir}')

    for cand in candidates:
        if cand.name.lower().startswith('produtosfomatodos') or cand.name.lower().startswith('produtosformat'):
            xlsx_path = cand
            break

    if xlsx_path is None:
        # fallback para o primeiro encontrado
        xlsx_path = candidates[0]
    json_output = base_dir / 'public' / 'produtos.json'
    report_output = base_dir / 'data' / 'relatorio_imagens.json'

    # Garantir que a pasta de output existe
    json_output.parent.mkdir(parents=True, exist_ok=True)

    if not xlsx_path.exists():
        raise FileNotFoundError(f'Arquivo XLSX nao encontrado: {xlsx_path}')
    else:
        print(f"Usando arquivo XLSX: {xlsx_path.name}")

    print("Lendo arquivo XLSX formatado...")

    existing_image_map = load_existing_image_map(json_output)
    print(f"Imagens fixas carregadas do JSON atual: {len(existing_image_map)}")

    # Ler arquivo
    xls = pd.ExcelFile(xlsx_path)

    resultado = {}
    total_produtos = 0

    print("Convertendo cada categoria...")
    report = {
        'summary': {
            'categorias': 0,
            'produtos': 0,
            'matched': 0,
            'fallback': 0,
            'category_without_folder': 0,
        },
        'details': []
    }

    for nome_aba in xls.sheet_names:
        # Ler dados da aba
        df = pd.read_excel(xls, sheet_name=nome_aba)

        # Agrupar por produto_grupo
        agrupados = {}

        for _, row in df.iterrows():
            # Pular linhas com dados inválidos
            if pd.isna(row['produto_grupo']) or pd.isna(row['descricao']):
                continue

            chave = row['produto_grupo']

            if chave not in agrupados:
                imagem, match_info = resolve_fixed_image(
                    chave, nome_aba, existing_image_map)

                agrupados[chave] = {
                    'id': chave,
                    'descricao': str(row['descricao']).strip(),
                    'categoria': nome_aba,
                    'imagem': imagem,
                    'variacoes': []
                }

                report['summary']['produtos'] += 1
                if match_info['status'] == 'fixed-existing':
                    report['summary']['matched'] += 1
                else:
                    report['summary']['fallback'] += 1
                    report['summary']['category_without_folder'] += 1

                report['details'].append(
                    {
                        'categoria': nome_aba,
                        'id': chave,
                        'descricao': str(row['descricao']).strip(),
                        'imagem': imagem,
                        'status': match_info['status'],
                        'score': match_info['score'],
                        'arquivo_sugerido': match_info['matched'],
                    }
                )

            # Adicionar variação
            # Ler possíveis nomes de coluna para preço no cartão (débito/crédito)
            preco_cartao_val = None
            for col_name in ('preco_debito_credito', 'preco_debito_e_credito', 'preco_cartao'):
                if col_name in df.columns:
                    preco_cartao_val = row[col_name]
                    break

            variacao = {
                'codigo': str(int(row['codigo'])) if pd.notna(row['codigo']) else '',
                'pesoValor': float(row['peso_valor']) if pd.notna(row['peso_valor']) else 0,
                'pesoUnidade': str(row['peso_unidade']).strip() if pd.notna(row['peso_unidade']) else '',
                'unidade': str(row['unidade']).strip() if pd.notna(row['unidade']) else '',
                'precoVenda': float(row['preco_venda']) if pd.notna(row['preco_venda']) else 0.0,
                'precoDebitoCredito': float(preco_cartao_val) if (preco_cartao_val is not None and pd.notna(preco_cartao_val)) else 0.0
            }

            agrupados[chave]['variacoes'].append(variacao)

        # Ordenar variações por peso
        for produto in agrupados.values():
            produto['variacoes'] = sorted(
                produto['variacoes'],
                key=lambda x: x['pesoValor']
            )

        # Converter dict para lista e adicionar ao resultado
        produtos_lista = list(agrupados.values())
        resultado[nome_aba] = produtos_lista

        print(f"  {nome_aba}: {len(produtos_lista)} produtos unicos")
        total_produtos += len(produtos_lista)
        report['summary']['categorias'] += 1

    sync_promo_images_by_id(resultado, report)

    # Salvar JSON
    print(f"\nSalvando JSON em: {json_output}")
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)

    with open(report_output, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("\nConversao concluida")
    print("Resumo:")
    print(f"  - Total de categorias: {len(resultado)}")
    print(f"  - Total de produtos unicos (agrupados): {total_produtos}")
    print(
        f"  - Produtos com imagem encontrada: {report['summary']['matched']}")
    print(f"  - Produtos com fallback: {report['summary']['fallback']}")
    print(f"\nArquivo criado: {json_output}")
    print(f"Relatorio criado: {report_output}")

    print("\nExemplo de estrutura (primeiros 2 produtos da primeira categoria):")
    primeira_categoria = list(resultado.values())[0]
    exemplo = json.dumps(primeira_categoria[:2], ensure_ascii=False, indent=2)
    print(exemplo)


if __name__ == '__main__':
    converter_xlsx_para_json()
