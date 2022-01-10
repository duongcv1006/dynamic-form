import { Button, Form, Input } from "antd";
import React, { useForm } from "antd/lib/form/Form";
import { Component } from "react/cjs/react.production.min";

class FormSwap extends Component {
  constructor(props) {
    super(props);
    const { defaultFields = [], onRef } = props;
    this.state = { fields: defaultFields, isRequire: false };
    onRef?.(this);
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef?.(undefined);
  }

  handleAdd = (fs) => {
    let { fields } = this.state;
    if (!fs) {
      return;
    }
    if (Array.isArray(fs)) {
      for (const f of fs) {
        this.handleMapField(fields, f);
      }
    } else {
      this.handleMapField(fields, fs);
    }
    this.setState({ fields });
  };

  handleMapField = (fields, fs) => {
    if (!fs.group) {
      fields.push(fs);
    } else {
      const check = fields.find((e) => e.group === fs.group);
      if (!check) {
        const item = {
          ...fs,
          items: [{ component: fs.componentItem?.(fs, fs), name: fs.name }],
        };
        delete item.componentItem;
        fields.push(item);
      } else {
        check.items.push({
          component: fs.componentItem?.(fs, check),
          name: fs.name,
        });
      }
      return fields;
    }
  };

  handleRemove = (field, key, v) => {
    const { fields } = this.state;
    let newFields = [];
    if (!key) {
      throw new Error("Key must be string");
    }
    if (!field) {
      newFields = fields.filter((f) => f[key] !== v);
    } else {
      newFields = fields.filter((f) => f[key] !== field[key]);
    }
    this.setState({ fields: newFields });
  };

  handleRemoveItem = (field, item) => {
    const { fields } = this.state;
    const newFields = fields.map((el) => {
      if (el.group === field.group) {
        const items = el.items.filter((e, i) => e.name !== item.name);
        return { ...el, items: items.map((e, id) => e.component(id, el)) };
      }
      return el;
    });

    this.setState({ fields: newFields });
  };

  submit = async () => {
    const { form } = this.props;
    return form.validateFields();
  };

  render() {
    const { form, children, onRef, defaultFields, defaultForm, ...props } =
      this.props;
    const { fields } = this.state;
    return (
      <Form
        form={form}
        {...props}
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 20,
          padding: 20,
          border: "2px solid #1A94FF",
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {fields.map((field, index) => {
          const { render, component, items, group, name, ...p } = field;
          if (render) {
            return render(index, form, items);
          }
          return (
            <Form.Item
              {...p}
              name={name || group}
              key={`filed_${index}`}
              className={`box-content-form-${name || group}`}
              rules={[
                {
                  required: this.state.isRequire,
                  message: "Please input your username!",
                },
              ]}
            >
              {component ? (
                typeof component === "function" ? (
                  component(
                    index,
                    group,
                    items,
                    form,
                    this.handleRemove,
                    this.handleRemoveItem
                  )
                ) : (
                  component
                )
              ) : (
                <Input />
              )}
            </Form.Item>
          );
        })}
        <Form.Item
          shouldUpdate
          className="btn-add-field"
          style={{ width: "100%", margin: 0 }}
        >
          {(props) =>
            children?.(
              this.handleAdd,
              this.handleRemove,
              fields,
              props,
              this.handleRemoveItem
            )
          }
        </Form.Item>
        <Form.Item
          shouldUpdate
          className="btn-required"
          style={{ width: "100%", margin: 0 }}
        >
          <Button
            onClick={() => {
              this.setState({ isRequire: !this.state.isRequire });
            }}
          >
            Required
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SwapForm = (p) => {
  const [form] = useForm();
  return <FormSwap {...p} form={form} />;
};

export default SwapForm;
