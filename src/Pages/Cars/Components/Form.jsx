import React, { Component } from "react";
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import { NotificationManager } from "react-notifications";
import update from "immutability-helper";
import PropTypes from "prop-types";

import Modals from "../../../Components/Modals";
import FormValidation from "../../../Components/FormValidation";

import InputText from "../../../Components/Form/InputText";
import InputTextArea from "../../../Components/Form/InputTextArea";
import InputSelect from "../../../Components/Form/InputSelect";

import { withHocks } from "../../../Context/WithParams";

import { getCarsCreate, getCarsUpdate } from "../../../Data";

import { CATCH_ERROR, GENERATE_ERROR_MESSAGE } from "../../../Helper/Error";
import { FORM_TYPES } from "../../../Enum/Form";
import { TYPE_LIST } from "../config";

class FormReveralCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        id: "",
        merek: "",
        jenis: "",
        stok: "",
        price: "",
        keterangan: "",
      },
      loading: true,
      onSend: false,
      isFormSubmitted: false,
    };
  }

  componentDidMount = () => {
    const { formType, form } = this.props;

    if (FORM_TYPES.EDIT === formType) {
      const { id, merek, jenis, stok, price, keterangan } = form;

      this.setState({
        form: {
          id,
          merek,
          jenis,
          stok,
          price,
          keterangan,
        },
      });
    }
  };

  _onInputChangeValidate = ({ target }) => {
    this.form.validateInput(target);
  };

  _changeInputHandler = async (type, val, e) => {
    const { form, isFormSubmitted } = this.state;

    if (isFormSubmitted && e) {
      const onInputChangeValidate = this._onInputChangeValidate(e);
      await onInputChangeValidate;
    }

    const newForm = update(form, {
      [type]: { $set: val },
    });

    this.setState({
      form: newForm,
    });
  };

  submitHandel = async () => {
    const isFormValid = await this.form.validateForm();

    if (isFormValid) {
      this.setState(
        {
          loading: true,
        },
        async () => {
          this.setState(
            {
              onSend: true,
            },
            async () => {
              await this.handleSubmit();
            }
          );
        }
      );
    }

    this.setState({
      isFormSubmitted: true,
    });
  };

  resetForm = () => {
    this.setState({
      form: {
        id: "",
        merek: "",
        jenis: "",
        stok: "",
        price: "",
        keterangan: "",
      },
      onSend: false,
    });
  };

  handleSubmit = async () => {
    const { form } = this.state;

    try {
      this.sendData(form);
    } catch (error) {
      this.setState(
        {
          onSend: false,
        },
        () => {
          NotificationManager.warning(
            CATCH_ERROR(error),
            "Terjadi Kesalahan",
            5000
          );
        }
      );
    }
  };

  sendData = async (data) => {
    const { formType } = this.props;
    const { id, merek, jenis, stok, price, keterangan } = data;

    const payload = {
			merek, jenis, stok, price, keterangan,
		};

		console.log(payload);
    if (formType === FORM_TYPES.CREATE) {
      try {
        await getCarsCreate(payload);

        NotificationManager.success(
          "Data Telah Tersimpan!, halaman ini akan segera di refresh",
          "Success",
          3000
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        this.setState(
          {
            onSend: false,
          },
          () => {
            NotificationManager.warning(
              CATCH_ERROR(error),
              "Terjadi Kesalahan",
              5000
            );
          }
        );
      }
    } else {
      try {
        await getCarsUpdate(payload, id);

        NotificationManager.success(
          "Data Telah Diupdate!, halaman ini akan segera di refresh",
          "Success",
          3000
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        this.setState(
          {
            onSend: false,
          },
          () => {
            NotificationManager.warning(
              CATCH_ERROR(error),
              "Terjadi Kesalahan",
              5000
            );
          }
        );
      }
    }
  };

  render() {
    const {
      form: { merek, jenis, stok, price, keterangan },
      onSend,
    } = this.state;
    const { idModal, onClick, buttonLabel, buttonIcon } = this.props;

    return (
      <Modals
        idModal={idModal}
        buttonIcon={buttonIcon}
        buttonLabel={buttonLabel}
        typeModal="primary"
        btnSubmitHandel={() => {
          this.submitHandel();
        }}
        btnCancelHandel={() => {
          this.resetForm();
        }}
        btnSubmitText={!onSend ? "Simpan" : "Menyimpan"}
        buttonSubmitIcon={onSend ? "fas fa-sync-alt fa-spin mx-2" : ""}
        btnSubmitDisabled={onSend}
        modalLarge={true}
        onClick={onClick}
      >
        <div className="row">
          <div className="col-md-12 my-2">
            <h3> Form User </h3>
            <hr />
            <FormValidation
              ref={(c) => {
                this.form = c;
              }}
            >
              <div className="d-flex flex-column mb-2">
                <div className="row">
                  <div className="col-md-6">
                    <label className="control-label">
                      Merek <span className="text-red"> * </span>
                    </label>
                    <div className="row">
                      <div className="col-md-12">
                        <InputText
                          placeholder="Merek"
                          name="merek"
                          value={merek}
                          changeEvent={(val, e) =>
                            this._changeInputHandler("merek", val, e)
                          }
                          required
                        />
                      </div>
                    </div>
                    <FieldFeedbacks for="merek">
                      <FieldFeedback when="valueMissing">
                        {GENERATE_ERROR_MESSAGE("Merek", "valueMissing")}
                      </FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">
                      Jenis Mobil <span className="text-red"> * </span>
                    </label>
                    <div className="row">
                      <div className="col-md-12">
                        <InputSelect
                          data={TYPE_LIST}
                          value={jenis}
                          changeEvent={(val, e) =>
                            this._changeInputHandler("jenis", val, e)
                          }
                          placeholder="Pilih Jenis Mobil"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column mb-2">
                <div className="row">
                  <div className="col-md-6">
                    <label className="control-label">
                      Stok <span className="text-red"> * </span>
                    </label>
                    <div className="row">
                      <div className="col-md-12">
                        <InputText
                          placeholder="Stok"
                          name="stok"
													type="number"
                          value={stok}
                          changeEvent={(val, e) =>
                            this._changeInputHandler("stok", val, e)
                          }
                          required
                        />
                      </div>
                    </div>
                    <FieldFeedbacks for="stok">
                      <FieldFeedback when="valueMissing">
                        {GENERATE_ERROR_MESSAGE("Stok", "valueMissing")}
                      </FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">
                      Harga Mobil <span className="text-red"> * </span>
                    </label>
                    <div className="row">
                      <div className="col-md-12">
                        <InputText
                          placeholder="Harga Mobil"
                          name="price"
													type="number"
                          value={price}
                          changeEvent={(val, e) =>
                            this._changeInputHandler("price", val, e)
                          }
                          required
                        />
                      </div>
                    </div>
                    <FieldFeedbacks for="price">
                      <FieldFeedback when="valueMissing">
                        {GENERATE_ERROR_MESSAGE("Harga Mobil", "valueMissing")}
                      </FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column mb-2">
                <label className="control-label">
                  Keterangan <span className="text-red"> * </span>
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <InputTextArea
                      placeholder="Keterangan"
                      name="keterangan"
                      value={keterangan}
                      changeEvent={(val, e) =>
                        this._changeInputHandler("keterangan", val, e)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </FormValidation>
          </div>
        </div>
      </Modals>
    );
  }
}

FormReveralCode.propTypes = {
  form: PropTypes.shape({}),
  formType: PropTypes.string,
  idModal: PropTypes.string,
  onClick: PropTypes.func,
  buttonLabel: PropTypes.string,
  buttonIcon: PropTypes.string,
};

FormReveralCode.defaultProps = {
  form: {},
  formType: FORM_TYPES.CREATE,
  idModal: "id-create",
  onClick: () => {},
  buttonLabel: "Tamabh Mobil",
  buttonIcon: "fas fa-plus mx-2",
};

export default withHocks(FormReveralCode);
