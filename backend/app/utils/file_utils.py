import re
import hashlib
import unicodedata

def clean_text(text: str) -> str:
    """
    Cleans extracted text for AI pipeline parsing.
    - normalizes unicode
    - removes duplicate spaces
    - removes empty lines
    - preserves headings and paragraphs
    - trims whitespace
    """
    if not text:
        return ""
        
    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    
    # Remove carriage returns
    text = text.replace('\r', '')
    
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Remove multiple empty newlines, preserving up to two for paragraphs/headings
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Trim leading/trailing whitespace
    return text.strip()

def compute_checksum(file_bytes: bytes) -> str:
    """Computes SHA-256 checksum of a file."""
    return hashlib.sha256(file_bytes).hexdigest()
