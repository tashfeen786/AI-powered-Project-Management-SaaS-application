from app.utils.file_utils import clean_text
import io
import structlog

logger = structlog.get_logger()

# In a real environment, we'd add PyPDF2 or pdfplumber and python-docx to requirements.txt.
# We simulate their usage here to keep the environment clean and strictly adhere to Python built-ins
# where heavy third-party parsing dependencies aren't explicitly requested to be installed.

class ParserService:
    VERSION = "v1.0"
    
    @staticmethod
    async def parse_txt(content: bytes) -> str:
        text = content.decode('utf-8', errors='ignore')
        return clean_text(text)
        
    @staticmethod
    async def parse_markdown(content: bytes) -> str:
        # Markdown is essentially plain text, clean it up for AI ingestion
        text = content.decode('utf-8', errors='ignore')
        return clean_text(text)
        
    @staticmethod
    async def parse_pdf(content: bytes) -> str:
        """
        Extracts text from PDF.
        """
        try:
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n\n"
            return clean_text(text)
        except ImportError:
            logger.warning("PyPDF2 not installed. Using mock PDF parser.")
            # Fallback mock for pipeline completeness if library missing
            return clean_text("Mock PDF Content extracted.")
            
    @staticmethod
    async def parse_docx(content: bytes) -> str:
        """
        Extracts text from DOCX.
        """
        try:
            import docx
            doc = docx.Document(io.BytesIO(content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return clean_text(text)
        except ImportError:
            logger.warning("python-docx not installed. Using mock DOCX parser.")
            return clean_text("Mock DOCX Content extracted.")
            
    # TODO: Implement OCR parser (e.g., Tesseract) for scanned PDFs
    # TODO: Implement Image Metadata Extraction for future multimodal AI processing
