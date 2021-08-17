import { createProxySchema } from "./constants";
import { Parser } from "@taquito/michel-codec";
import { Schema } from "@taquito/michelson-encoder";
import { MichelsonMap } from '@taquito/taquito'

export const packParticipantMap = (participantData) => {
    const participantMap = MichelsonMap.fromLiteral(participantData);
    const parser = new Parser();
    const michelsonType = parser.parseData(createProxySchema);
    const schema = new Schema(michelsonType);
    const data = schema.Encode(participantMap);

    return {
        data,
        type: michelsonType,
    }
}


export const extractAddress = (input) => {
    const tzPattern = /^.*(tz[\w\d]{34}).*$/i
    let matches = tzPattern.exec(input.trim())

    // Check for contract patterns
    if (!matches) {
        const ktPattern = /^.*(kt[\w\d]{34}).*$/i
        matches = ktPattern.exec(input.trim())
    }

    if (!matches) {
        return false
    }

    return matches[1];
}

export const groupShareTotal = collaborators => collaborators.reduce((sharesAllocated, c) => (c.shares || 0) + sharesAllocated, 0)
