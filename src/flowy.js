import React from "react";
import ReactFlow, {
    removeElements,
    addEdge,
    Background,
    Controls,
} from "react-flow-renderer";
export default function flowy(props) {
    return (
        <div>
            <ReactFlow
                elements={props.elements}
                onElementsRemove={props.onElementsRemove}
                onConnect={props.onConnect}
                deleteKeyCode={46} /* 'delete'-key */
            >
                <Controls />
                <Background variant="lines" gap={20} size={2} />
            </ReactFlow>
        </div>
    );
}
