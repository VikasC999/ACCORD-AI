import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_ai(contract_text):

    prompt = f"""
You are an AI Contract Review Assistant.

Return ONLY valid JSON.

Do not include:
- Markdown
- Triple backticks
- Explanations
- Notes

Your response must begin with {{ and end with }}.

Format:

{{
    "contract_type":"",
    "parties":[],
    "effective_date":"",
    "duration":"",
    "payment_terms":"",
    "governing_law":"",
    "risk_level":"",
    "risk_score":0,
    "summary":"",
    "risky_clauses":[
        {{
            "clause":"",
            "original_text":"",
            "severity":"",
            "reason":"",
            "plain_english":"",
            "suggestion":
        }}
    ],
    "recommendations":[],
    "missing_clauses":[]
}}

Rules:

- summary should be one paragraph only.
Do NOT use line breaks.
- The output must be valid JSON.
Do not include newline characters inside string values.
- risk_level must be Low, Medium or High.
- risk_score must be an integer between 0 and 100.

Scoring Guidelines:

0-25 = Very Low Risk
26-50 = Low Risk
51-75 = Medium Risk
76-100 = High Risk

The score should be based on the overall legal and business risk of the contract.

Consider:
- Number of risky clauses
- Severity of risky clauses
- Missing protections
- Payment risks
- Termination risks
- Legal ambiguity

The risk_score must be consistent with the risk_level.

Examples:
risk_score: 18 -> Low
risk_score: 62 -> Medium
risk_score: 91 -> High
- Only include risky clauses that exist.
For every risky clause:

- original_text:
Return the original clause text exactly as it appears in the contract.
If the exact clause cannot be extracted, return an empty string.

- plain_english:
Explain the clause in simple English that anyone can understand.
Maximum 2 sentences.

- suggestion:
Suggest one practical improvement to reduce the legal risk.
Maximum 1 sentence.

Do NOT invent information that is not present in the contract.
- parties must be an array containing the names of all parties involved in the contract.
- If no parties are found, return an empty array [].
- effective_date should contain the contract's start or effective date.
- If no effective date exists, return an empty string.
- duration should contain the contract duration if explicitly mentioned.
Examples:
"45 days"
"12 months"
"2 years"
"Until terminated"

If not specified, return an empty string.

Do NOT calculate the duration from dates.
Only extract what is explicitly written.
- payment_terms should summarize how and when payments are made.

Examples:
"50% upfront and 50% upon completion."
"Monthly payment of INR 20,000."
"Net 30 days after invoice."

If payment terms are not mentioned, return an empty string.

Do NOT invent payment terms.
Only extract information explicitly present in the contract.
- governing_law should contain the governing law or jurisdiction explicitly mentioned in the contract.

Examples:
"India"
"State of California"
"England and Wales"

If not mentioned, return an empty string.

Do NOT infer or guess the governing law.
Only extract what is explicitly written.
- recommendations should be an array containing practical suggestions to improve the contract.

Examples:
[
    "Increase the termination notice period to at least 30 days.",
    "Clearly define late payment penalties.",
    "Specify ownership of intellectual property after project completion."
]

Rules:

- Maximum 5 recommendations.
- Keep each recommendation to one sentence.
- Only recommend changes based on the actual contract.
- Do NOT invent missing information.
- If no recommendations are needed, return an empty array [].
- If none exist return [].

Contract:

{contract_text}
"""

    completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    temperature=0,
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
)

    response = completion.choices[0].message.content.strip()

    response = response.replace("```json", "").replace("```", "").strip()
    print("========== AI RESPONSE ==========")
    print(response)
    print("=================================")

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {
        "contract_type": "",
        "risk_level": "Unknown",
        "summary": "Failed to parse AI response.",
        "risky_clauses": []
    }
def ask_contract_question(contract_text, question):

    prompt = f"""
You are AccordAI, an AI Contract Assistant.

Answer the user's question ONLY using the contract provided below.

Rules:
- Do not make up information.
- If the answer is not present in the contract, say:
  "This information is not mentioned in the contract."
- Keep answers concise (2-5 sentences).
- Do not mention that you are an AI language model.

Contract:
{contract_text}

Question:
{question}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return completion.choices[0].message.content.strip()
def rewrite_clause(original_clause):

    prompt = f"""
You are an experienced contract lawyer.

Rewrite the following contract clause to make it legally stronger,
clearer, and fairer while preserving its original intent.

Rules:
- Return ONLY the rewritten clause.
- Do NOT explain your reasoning.
- Do NOT use markdown.
- Keep the same legal meaning but reduce risk.
- Write in professional legal language.

Original Clause:

{original_clause}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return completion.choices[0].message.content.strip()