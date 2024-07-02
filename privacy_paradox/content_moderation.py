import re

def moderate_content(content):
    # Remove profanity
    content = re.sub(r'\b(fuck|shit|bitch|ass)\b', '[removed]', content, flags=re.IGNORECASE)
    # Remove URLs
    content = re.sub(r'https?://\S+', '[removed]', content)
    # Remove email addresses
    content = re.sub(r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b', '[removed]', content)
    return content