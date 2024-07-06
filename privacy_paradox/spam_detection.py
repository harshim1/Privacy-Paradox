import re

def detect_spam(content):
    # Check for spam keywords
    spam_keywords = ['buy now', 'click here', 'free trial']
    for keyword in spam_keywords:
        if re.search(keyword, content, re.IGNORECASE):
            return True
    # Check for excessive punctuation
    if re.search(r'[!?.]{3,}', content):
        return True
    # Check for all caps
    if re.search(r'^[A-Z]+$', content):
        return True
    return False