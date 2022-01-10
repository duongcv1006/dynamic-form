import { Fragment, useState } from "react";
import { Button, Radio, Select, Space, Input, Row, Col } from "antd";
import { Form } from "antd";
import "./App.css";
import FormController from "./FormController";

const App = (props) => {
  const [formController] = FormController.useForm();
  const [valueSelect, setSelect] = useState("");

  const renderComponentSelect = (value, input, fncRemove, fields) => {
    switch (value) {
      case "select1":
        let fd = fields.find((e) => e.group === "radio_checkbox") || {
          items: [],
        };
        const item = {
          group: "radio_checkbox",
          name: `radio_checkbox_${fd.items.length}`,
          component: (key, name, items) => {
            return (
              <Radio.Group key={key} name={name} style={{ width: "100%" }}>
                <Space direction="vertical">
                  {items.map((e, i) => (
                    <Fragment key={i}>{e.component}</Fragment>
                  ))}
                </Space>
              </Radio.Group>
            );
          },
          componentItem: (k, parent) => (
            <Fragment key={input}>
              <Radio key={input} value={input}>
                {input}
              </Radio>
              <Button
                onClick={() => {
                  fncRemove(parent, k);
                }}
              >
                xoá
              </Button>
            </Fragment>
          ),
        };
        return [item];
      case "select2":
        let f = fields.find((e) => e.group === "list_input") || {
          items: [],
        };
        return [
          {
            group: "list_input",
            name: `radio_checkbox_${f.items.length}`,
            component: (key, name, items) => {
              return (
                <Input.Group key={key}>
                  <Row>
                    <Col>
                      {items.map((e, i) => (
                        <Fragment key={i}>{e.component}</Fragment>
                      ))}
                    </Col>
                  </Row>
                </Input.Group>
              );
            },
            componentItem: (
              <Input maxLength={100} key={input} defaultValue={input} />
            ),
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <FormController
        defaultForm={[
          {
            children: (add, remove, fields, form, removeItem) => {
              const { select, input } = form.getFieldsValue();
              if (!select) return null;
              return (
                <Button
                  onClick={() => {
                    form.setFieldsValue({ input: "" });
                    const x = renderComponentSelect(
                      select,
                      input,
                      removeItem,
                      fields
                    );
                    add(x);
                  }}
                >
                  Add Field
                </Button>
              );
            },

            defaultFields: [
              {
                name: "input",
                label: "Tên trường dữ liệu",
                rules: [
                  {
                    required: false,
                  },
                ],
              },
              {
                name: "select",
                label: "Loại dữ liệu",
                component: (key, group, items, form, remove) => (
                  <Select
                    key={key}
                    onChange={(value) => {
                      if (value === "select1") {
                        remove(undefined, "group", "list_input");
                      } else {
                        remove(undefined, "group", "radio_checkbox");
                      }
                      setSelect(value);
                      // console.log("select value", value);
                    }}
                  >
                    <Select.Option value="select1">
                      asdasdadaasdas
                    </Select.Option>
                    <Select.Option value="select2">ahihaiaihj</Select.Option>
                  </Select>
                ),
              },
            ],
          },
        ]}
        layout="vertical"
      />
      <Button
        onClick={() => {
          formController.add({
            children: (add, _remove, fields, form) => {
              const { select, input } = form.getFieldsValue();
              if (!select) return null;
              return (
                <Button
                  onClick={() => {
                    form.setFieldsValue({ input: "" });
                    add([
                      {
                        group: "radio_checkbox",
                        component: (key, name, items) => {
                          return (
                            <Radio.Group
                              key={key}
                              name={name}
                              style={{ width: "100%" }}
                            >
                              {items.map((e, k) => (
                                <Fragment key={k}>{e.component}</Fragment>
                              ))}
                            </Radio.Group>
                          );
                        },
                        componentItem: (
                          <Radio key={input} value={input}>
                            {input}
                          </Radio>
                        ),
                      },
                    ]);
                  }}
                >
                  Add Field
                </Button>
              );
            },
            defaultFields: [
              {
                name: "input",
                label: "Tên trường dữ liệu",
                // component: <Radio />
                // rules: [
                //   {
                //     required: true,
                //   },
                // ],
              },
              {
                name: "select",
                label: "Loại dữ liệu",
                rules: [
                  {
                    required: true,
                  },
                ],
                component: (
                  <Select>
                    <Select.Option value="1">asdasdadaasdas</Select.Option>
                  </Select>
                ),
              },
            ],
          });
        }}
      >
        AddForm
      </Button>
      <Button
        onClick={() => {
          formController
            .submit()
            .then((values) => {
              console.log(values);
            })
            .catch((e) => {
              console.log("e", e);
            });
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default App;
