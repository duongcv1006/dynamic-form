import { Fragment } from "react";
import { Component } from "react/cjs/react.production.min";
import FormSwap from "./FormSwap";

let formController = {
  add: () => null,
  submit: async () => null,
};

class FormController extends Component {
  constructor(props) {
    super(props);
    const {defaultForm = []} = props;
    this.state = { list: defaultForm };
    this.refForm = {};
    formController.add = this.handleAddForm;
    formController.submit = this.handleSubmit;
  }

  handleAddForm = (data = {}) => {
    const { list } = this.state;
    this.setState({ list: [...list, data] });
  };

  handleSubmit = async () => {
    const { list } = this.state;
    const promise = list.map(async (_item, index) => {
      return this.refForm[index].submit();
    });
    return Promise.all(promise);
  };

  render() {
    const { list } = this.state;
    return (
      <Fragment>
        {list.map((form, index) => (
          <FormSwap
            key={index.toString()}
            onRef={(ref) => {
              if (ref) {
                this.refForm[index] = ref;
              } else {
                delete this.refForm[index];
              }
            }}
            {...form}
            {...this.props}
          />
        ))}
      </Fragment>
    );
  }
}

FormController.useForm = () => [formController];

export default FormController;
