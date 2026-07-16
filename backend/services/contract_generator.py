from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_contract(data):
    prompt = f"""
You are a legal contract drafting assistant.

Generate a professional {data['contractType']}.

Details:

{data}

Instructions:

- Generate a professional {data['contractType']}.
- Use only the information provided above.
- If any information is missing, leave placeholders like [Enter Company Address].
- Include all standard legal clauses relevant to this contract type.
- Format the document professionally with headings and numbered sections.
- Return only the contract text.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content