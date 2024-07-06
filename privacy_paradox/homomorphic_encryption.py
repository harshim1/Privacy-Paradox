import seal

def encrypt_message(content):
    # Initialize the SEAL library
    seal_ctx = seal.SEALContext()

    # Create a secret key
    secret_key = seal.SecretKey()

    # Encrypt the message
    encrypted_content = seal.encrypt(content, secret_key)

    return encrypted_content