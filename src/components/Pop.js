import React, { memo, useState } from "react";
import { Popover, Button, Input, Form, InputNumber } from "antd";
import { Handle } from "react-flow-renderer";
export default memo(({ data, id }) => {
    const [visible, setVisible] = useState(false);
    const [question, setQuestion] = useState(data.question);

    const hide = () => {
        setVisible(false);
    };
    const updateFields = (value) => {
        if (value.question) {
            setQuestion(value.question);
        }
        setVisible(false);
        data.onChange(id, value.question);
    };
    const handleVisibleChange = (visible) => {
        setVisible(visible);
    };

    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{ background: "#555" }}
            />
            <Handle
                type="source"
                position="right"
                style={{ background: "#555" }}
            />

            <Button size="large">
                <div>
                    <div>{question}</div>
                    <Popover
                        content={<CForm handler={updateFields} />}
                        trigger="click"
                        visible={visible}
                        onVisibleChange={handleVisibleChange}
                    >
                        <Button size="small">+</Button>
                    </Popover>
                </div>
            </Button>
            {/* <input
                className="nodrag"
                type="color"
                onChange={data.onChange}
                defaultValue={data.color}
            /> */}
        </>
    );
});

export const CForm = (props) => {
    const onFinish = (values) => {
        console.log(values);
        props.handler(values);
    };
    return (
        <Form
            // {...layout}
            name="basic"
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
        >
            <Form.Item
                style={{ margin: 5 }}
                label="Question"
                name="question"
                rules={[{ message: "Please input Question" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
