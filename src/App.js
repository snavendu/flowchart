import React, { useState, useRef, useCallback, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import Custom, { CForm } from "./components/Pop";

import ReactFlow, {
    removeElements,
    addEdge,
    Background,
    Controls,
    ReactFlowProvider,
} from "react-flow-renderer";
import initials from "./initials";
import Sider from "antd/lib/layout/Sider";
import { Content } from "antd/lib/layout/layout";
const nodeTypes = {
    selectorNode: Custom,
};

export default () => {
    const [elements, setElements] = useState(initials);
    const [value, setvalue] = useState("");
    const [data, setdata] = useState({});
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [id, setid] = useState(0);
    const [sel, setsel] = useState();
    useEffect(() => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === sel) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.data = {
                        ...el.data,
                        label: value,
                    };
                }
                return el;
            })
        );
    }, [value, setElements]);
    const onElementClick = (event, element) => setsel(element.id);
    const getId = () => {
        const nId = id + 1;
        setid(nId);
        return `node_${id}`;
    };
    const onLoad = (_reactFlowInstance) =>
        setReactFlowInstance(_reactFlowInstance);

    const onConnect = (params) => {
        const { source, target } = { ...params };
        console.log("params", params);
        const nD = { ...data };
        if (nD[source]) {
            console.log("hey", nD[source]);
            nD[source] = [...nD[source], target];
        } else {
            nD[source] = [target];
        }
        setdata(nD);
        console.log("data transfer", data, elements);

        setElements((els) => addEdge(params, els));
    };
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };
    const onElementsRemove = useCallback(
        (elementsToRemove) =>
            setElements((els) => removeElements(elementsToRemove, els)),
        []
    );
    const { Header, Content, Footer, Sider } = Layout;
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };
    const onChange = (id, question) => {
        setElements((els) =>
            els.map((e) => {
                if (e.id !== id) {
                    return e;
                }
                return { ...e, data: { ...e.data, question } };
            })
        );
        console.log(elements);
    };
    const onDrop = (event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        console.log(type);
        const id = getId();
        const newNode =
            type === "selectorNode"
                ? {
                      id: id,
                      type,
                      position,
                      data: {
                          label: `Question Node`,
                          question: "select question of your type?",
                          onChange: onChange,
                      },
                      sourcePosition: "right",
                  }
                : type === "input"
                ? {
                      id: id,
                      type,
                      position,
                      data: { label: `${type} node` },
                      sourcePosition: "right",
                  }
                : {
                      id: id,
                      type,
                      position,
                      data: { label: `${type} node` },
                      targetPosition: "left",
                      onConnect: (params) => console.log(params),
                  };
        console.log(newNode);
        setElements((es) => es.concat(newNode));
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <ReactFlowProvider>
                <Sider
                    collapsible
                    collapsed={collapse}
                    onCollapse={() => setCollapse(!collapse)}
                >
                    <Menu theme="dark" mode="inline">
                        <Menu.Item
                            draggable
                            onDragStart={(event) => onDragStart(event, "input")}
                        >
                            Input
                        </Menu.Item>
                        <Menu.Item
                            draggable
                            onDragStart={(event) =>
                                onDragStart(event, "output")
                            }
                        >
                            output
                        </Menu.Item>
                        <Menu.Item
                            draggable
                            onDragStart={(event) =>
                                onDragStart(event, "default")
                            }
                        >
                            default
                        </Menu.Item>
                        <Menu.Item
                            draggable
                            onDragStart={(event) =>
                                onDragStart(event, "selectorNode")
                            }
                        >
                            custom
                        </Menu.Item>
                        <Menu.SubMenu title="Tools">
                            <Menu.Item>
                                <Button
                                    type="primary"
                                    onClick={() => console.log(elements)}
                                >
                                    Save
                                </Button>
                            </Menu.Item>
                            <Menu.Item>
                                <CForm handler={(v) => setvalue(v.question)} />
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Sider>

                <Layout>
                    <Content>
                        <div style={{ height: "100vh" }} ref={reactFlowWrapper}>
                            <ReactFlow
                                onElementClick={onElementClick}
                                elements={elements}
                                onElementsRemove={onElementsRemove}
                                onConnect={onConnect}
                                deleteKeyCode={46} /* 'delete'-key */
                                nodeTypes={nodeTypes}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                // style={{ background: "#212345" }}
                                onLoad={onLoad}
                            >
                                <Controls />
                                {/* <Background variant="lines" gap={20} size={2} /> */}
                            </ReactFlow>
                        </div>
                    </Content>
                </Layout>
            </ReactFlowProvider>
        </Layout>
    );
};
