// API Types for Agent Chat

/** Request payload for the chat API */
export interface ChatRequest {
    /** 사용자의 자연어 질문 */
    question: string
}

/** Metadata for risk data items */
export interface RiskDataMetadata {
    공종명?: string
    현장명?: string
    작업장소?: string
    단위작업: string
    재해유형명?: string
    재해유형?: string
    위험등급: string
    파일명?: string
    적용년월?: string
    세부공종?: string
    chunk_id?: string
    source?: string
    source_abs?: string
    file_sig?: string
    _id?: string
    _collection_name?: string
}

/** Individual risk data item */
export interface RiskData {
    content: string
    metadata: RiskDataMetadata
}

/** State object in the API response */
export interface ChatState {
    question: string
    category: string
    risk_data: RiskData[]
    risk_text: string
    answer_text: string
    next: string
}

/** Response from the chat API */
export interface ChatResponse {
    answer: string
    state: ChatState
}

/** Message type for UI rendering */
export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    riskData?: RiskData[]
}
