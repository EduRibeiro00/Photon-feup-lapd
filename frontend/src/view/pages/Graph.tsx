import React, { useEffect, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import { useGetResource } from "../../viewmodel/hooks/getResource";
import { getGraphData } from "../../viewmodel/providers/getGraphData";
import Popup from "../components/NodePopup";
import Node from "../../model/node";
import Link from "../../model/link";
import MainScreen from "./templates/MainScreen";

type GraphData = {
    nodes: Node[],
    links: Link[],
}

function isNodeVisible(node: Node): boolean {
    return node.visible;
}

function isLinkVisible(this: Set<string>, link: any): boolean {
    if (link.source.id !== undefined && link.source.id !== undefined)
        return this.has(link.source.id) && this.has(link.target.id);
    return this.has(link.source) && this.has(link.target);
}

function getVisibleResource(resource: GraphData): GraphData {
    let visibleResource = {nodes: [], links: []} as GraphData;
    if (resource) {
        visibleResource.nodes = resource.nodes.filter(isNodeVisible);
        const visibleNodesIds = new Set(visibleResource.nodes.map(node => node.id));
        visibleResource.links = resource.links.filter(isLinkVisible, visibleNodesIds);
    }
    return visibleResource;
}

let load = true;
const min = 0, max = 100;
let maxmin: number[] = [min, max, min, max, min, max];

export default function Graph(): JSX.Element {
    const [tweetsRange, setTweetsRange] = useState([min, max]);
    const [newsRange, setNewsRange] = useState([min, max]);
    const [redditsRange, setRedditsRange] = useState([min, max]);
    const dataResource = useGetResource(getGraphData.bind(null, tweetsRange, redditsRange, newsRange),
        [tweetsRange, redditsRange, newsRange]
    ).data;
    let resource = (dataResource ? dataResource.records : {nodes: [], links: []}) as GraphData;
    if (dataResource && load) {
        load = false;
        maxmin = dataResource.maxmin;
        setTweetsRange([maxmin[0], maxmin[1]]);
        setNewsRange([maxmin[2], maxmin[3]]);
        setRedditsRange([maxmin[4], maxmin[5]]);
    }
    const myGraph = ForceGraph3D();
    const [focusedNode, setFocusedNode] = useState(undefined);

    useEffect(() => {
        function expandNode(node: any) {
            resource?.links.forEach(link => {
                if (link.source === node.id) {
                    for (let i = 0; i < resource.nodes.length; i++) {
                        if (resource.nodes[i].id === link.target) {
                            resource.nodes[i].visible = true;
                            break;
                        }
                    }
                }
            });
        }

        function focusNode(node: any) {
            // Display popup
            const popup = document.getElementById("popup");
            if (popup) popup.setAttribute("style", "display: block");

            // Aim at node from outside it
            const distance = 300;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        
            myGraph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                2000  // ms transition duration
            );

            setFocusedNode(node);
            expandNode(node);
            showGraph();
        }

        function defocusNode() {
            setFocusedNode(undefined);
        }
        
        function showGraph() {
            myGraph.graphData(getVisibleResource(resource));
            // @ts-ignore
            myGraph.d3Force('charge')?.strength(-2);
        }

        let element = document.getElementById("graph");
        if (element) {
            myGraph(element).onNodeHover((node: any) => {
                if (element) element.style.cursor = node ? "pointer" : "auto"
            })
            .onNodeClick(focusNode)
            .nodeAutoColorBy("label")
            .linkAutoColorBy("label")
            .linkWidth(5)
            .onBackgroundClick(defocusNode)
            .graphData(getVisibleResource(resource));
            // @ts-ignore
            myGraph.d3Force('link')?.distance(200);
        }

        // eslint-disable-next-line
    }, [resource]);


    const popup = focusedNode === undefined ?
        null
        : 
        (
            <div>
                <Popup node={focusedNode} />
            </div>
        );
    
    return (
        <MainScreen hasFilteringMenu={true} tweetsMaxMin={[maxmin[0],maxmin[1]]} tweetsRangeFunc={setTweetsRange} redditsMaxMin={[maxmin[4],maxmin[5]]} redditsRangeFunc={setRedditsRange} newsMaxMin={[maxmin[2],maxmin[3]]} newsRangeFunc={setNewsRange}>
            <div id="graph" />
            {popup}
        </MainScreen>
    );
}
