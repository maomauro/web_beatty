import json
from typing import List, Dict, Optional

def parse_product_images(imagen_field: Optional[str]) -> Dict[str, any]:
    """
    Parsea el campo imagen del producto para manejar múltiples imágenes.
    Soporta diferentes formatos:
    - JSON: {"principal": "url1", "galeria": ["url1", "url2"]}
    - URL simple: "url1"
    - URLs separadas por comas: "url1,url2,url3"
    - URLs separadas por pipe: "url1|url2|url3"
    """
    if not imagen_field:
        return {
            "principal": "/static/images/products/default.webp",
            "galeria": ["/static/images/products/default.webp"]
        }
    
    # Intentar parsear como JSON
    try:
        data = json.loads(imagen_field)
        if isinstance(data, dict):
            principal = data.get("principal", data.get("galeria", [""])[0] if data.get("galeria") else "")
            galeria = data.get("galeria", [principal]) if principal else []
            return {
                "principal": principal,
                "galeria": galeria
            }
    except (json.JSONDecodeError, TypeError):
        pass
    
    # Si no es JSON, tratar como URLs separadas
    urls = []
    if "," in imagen_field:
        urls = [url.strip() for url in imagen_field.split(",") if url.strip()]
    elif "|" in imagen_field:
        urls = [url.strip() for url in imagen_field.split("|") if url.strip()]
    else:
        # URL única
        urls = [imagen_field.strip()] if imagen_field.strip() else []
    
    if not urls:
        return {
            "principal": "/static/images/products/default.webp",
            "galeria": ["/static/images/products/default.webp"]
        }
    
    # Convertir nombres de archivo a URLs completas del backend
    processed_urls = []
    for url in urls:
        if url.startswith(('http://', 'https://')):
            # Es una URL completa, mantenerla
            processed_urls.append(url)
        else:
            # Es un nombre de archivo, convertir a URL del backend
            processed_urls.append(f"/static/images/products/{url}")
    
    return {
        "principal": processed_urls[0],
        "galeria": processed_urls
    }

def format_product_images(principal_url: str, galeria_urls: Optional[List[str]] = None) -> str:
    """
    Formatea las imágenes del producto para guardar en la base de datos.
    Retorna un JSON string.
    """
    if not galeria_urls:
        galeria_urls = [principal_url]
    
    data = {
        "principal": principal_url,
        "galeria": galeria_urls
    }
    
    return json.dumps(data, ensure_ascii=False)

def get_principal_image(imagen_field: Optional[str]) -> str:
    """
    Obtiene la imagen principal del producto.
    """
    parsed = parse_product_images(imagen_field)
    return parsed["principal"]

def get_image_gallery(imagen_field: Optional[str]) -> List[str]:
    """
    Obtiene la galería de imágenes del producto.
    """
    parsed = parse_product_images(imagen_field)
    return parsed["galeria"]
