export interface PersonalityDefine {
    constraint: string;
    tone: string;
    action: string;
}

export interface InclusiveHistoryMessage {
    role: string,
    content: string,
}

export interface HistoryAskRequestBody {
    messageHistory: InclusiveHistoryMessage[];
    prompt: string;
}
