type SSEEvent = {
    event: string
    data: {
        p: string | null
        v: string | Array<{ p: string, v: string }>
    }
}

export const parseSSE = (data: string) => {
    const events = data.trim().split(/\n\n|\r\n\r\n/);
    const parsedEvents: SSEEvent[] = [];

    for (const eventBlock of events) {
        const lines = eventBlock.split(/\n|\r\n/);
        let eventType = null;
        let eventData = '';

        for (const line of lines) {
            if (line.startsWith('event: ')) {
                eventType = line.replace('event: ', '').trim();
            } else if (line.startsWith('data: ')) {
                eventData += line.replace('data: ', '').trim();
            }
        }

        if (eventType && eventData) {
            parsedEvents.push({ event: eventType, data: JSON.parse(eventData) });
        }
    }

    return parsedEvents;
}

export const extractData = (eventsArr: SSEEvent[]) => {
    let _data = "";
    for(const { event, data } of eventsArr) {
        if(event != "delta")
            continue;
        if(typeof data == "object" && !Array.isArray(data)) {
            const { p, v } = data;
            if((!p || p == "/message/content/parts/0") && typeof v == "string") {
                _data += v;
            } else if(!p && Array.isArray(v)) {
                for(const o of v) {
                    if(o.p == "/message/content/parts/0" && typeof o.v == "string") {
                        _data += o.v
                    }
                }
            }
        }
    }
    return _data;
}