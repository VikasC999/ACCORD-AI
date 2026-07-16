AccordAI

AI-powered contract analysis and generation — running entirely on local, free infrastructure.

AccordAI helps users analyze legal contracts, flag risky clauses, generate new contracts from templates, and chat directly with their documents — all without relying on paid third-party APIs. Every piece of the pipeline, including the LLM, runs locally.


✨ Features


Contract Analysis — Upload a contract and get clause-level risk detection using a hybrid rule-based (regex) + LLM verification pipeline.
Contract Generation — Generate new contracts from structured templates.
RAG-Lite Chatbot — Chat directly with your uploaded contracts to ask questions and get grounded, context-aware answers.
Fully Local Inference — No paid APIs. All LLM calls run through Ollama (Mistral 7B) on your own machine.
Privacy-Preserving — Sensitive legal documents never leave your local environment.



🛠️ Tech Stack

LayerTechnologyBackendFastAPI, SQLiteFrontendReact, Vite, TypeScript, Tailwind CSSLLM InferenceOllama running Mistral 7B (local)Risk DetectionRegex/rule-based extraction + LLM verificationChat / RetrievalRAG-lite pipeline over contract content


🧠 Why These Design Choices?


SQLite over PostgreSQL — Kept the backend lightweight and simple for a single-user, local-first application.
Rule-based + LLM verification over ML classifiers (e.g. XGBoost) — No labeled training data was available for risk classification, so a regex + LLM verification approach was used instead for reliable clause detection.
Local LLM inference (Ollama/Mistral 7B) over paid APIs — Keeps the tool free to run and ensures sensitive contract data stays entirely on-device.
