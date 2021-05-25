import axios from "axios";
import Link from "../../model/link";
import Node from "../../model/node";
import Sector from "../../model/sector";
import Tweet from "../../model/tweet";
import mainLabels from "../../model/labels.json";

type GraphData = {
    nodes: Node[],
    links: Link[],
}

function parseTweet(id: string, properties: any): Tweet {
    const label = "Tweet";
    const authorId = properties["author_id"];
    const createdAt = properties["created_at"];
    const likeCount = properties["like_count"]["high"];
    const dislikeCount = properties["like_count"]["low"];
    const quoteCount = properties["quote_count"]["high"] + properties["quote_count"]["low"];
    const replyCount = properties["reply_count"]["high"] + properties["reply_count"]["low"];
    const retweetCount = properties["retweet_count"]["high"] + properties["retweet_count"]["low"];
    const text = properties["text"];

    return new Tweet(id, label, authorId, createdAt, likeCount, dislikeCount, quoteCount, replyCount, retweetCount, text);
}

function parseClass(id: string, properties: any): Sector {
    const label = "Class";
    const name = properties["n4sch__label"] ? properties["n4sch__label"] : properties["n4sch__name"];
    const uri = properties["uri"];

    return new Sector(id, label, name, uri);
}

function parseNode(node: any): Node | null {
    const id = `${node["identity"]["high"]}_${node["identity"]["low"]}`;    
    const labels = node["labels"];
    const mainLabel = labels.length >= 2 ? (labels[1]).substring(7) : labels[0];
    const properties = node["properties"];

    switch(mainLabel) {
        case mainLabels.class:
            return parseClass(id, properties);
        case mainLabels.relationship:
            // TODO: parse relationships?
            break;
        case mainLabels.twitter:
            return parseTweet(id, properties);
        case mainLabels.reddit:
            // TODO: parse reddit?
            break;
        default:
            break;
    }
    return null;
}

function parseLink(link: any): Link {
    const id = `${link["identity"]["high"]}_${link["identity"]["low"]}`;
    const source = `${link["start"]["high"]}_${link["start"]["low"]}`;
    const target = `${link["end"]["high"]}_${link["end"]["low"]}`;
    const type = link["type"];

    return new Link(id, source, target, type);
}

function handleGraphData(graphData: any): GraphData {
    let nodes: Node[] = [];
    let links: Link[] = [];
    let processedIds: Set<string> = new Set();

    graphData.forEach((element: any) => {
        const fields = element["_fields"];

        //Origin
        const origin = parseNode(fields[0]);
        if (!origin) return;
        
        //Dest
        const dest = parseNode(fields[2]);
        if (!dest) return;

        // Insert nodes (avoiding duplicates)
        if (!processedIds.has(origin.id)) {
            nodes.push(origin);
            processedIds.add(origin.id);
        }
        if (!processedIds.has(dest.id)) {
            nodes.push(dest);
            processedIds.add(dest.id);
        }

        //Link
        const link = parseLink(fields[1]);
        links.push(link);
    });

    let data: GraphData;
    data = {nodes, links};
    return data;
}

export function getGraphData(): Promise<GraphData> {

    return axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/graph`,
    ).then((response) =>
        handleGraphData(response.data),
    ).catch((err) => {
        throw err;
    });
}
