import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect, useDispatch } from "react-redux";
import {
  loadingToggleAction,
  companySignupAction,
} from "../../store/actions/AuthActions";
import {
  getListCompanyType,
  getListIndustry,
} from "../../services/GetListService";
import { getInfoCompany } from "../../services/CompanyApi";

var bnr = require("./../../images/background/bg6.jpg");
function Register2(props) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [field, setField] = useState([]);
  const [mainIndustry, setMainIndustry] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [managedBy, setManagedBy] = useState("");
  const [engName, setEngName] = useState("");
  const [sortName, setSortName] = useState("");
  const [address, setAddress] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [representative, setRepresentative] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [status, setStatus] = useState("");
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [step, setStep] = useState(1);

  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);

  let errorsObj = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    position: "",
    phone: "",
    companyType: "",
    field: "",
    companyName: "",
    address: "",
    taxCode: "",
    mainIndustry: "",
    businessLicense: "",
  };
  const [errors, setErrors] = useState(errorsObj);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      let listCompanyType = (await getListCompanyType()).data;
      setCompanyTypeOptions(
        listCompanyType.map((item) => ({ value: item._id, label: item.name }))
      );
      let listField = (await getListIndustry()).data;
      setFieldOptions(
        listField.map((item) => ({ value: item._id, label: item.name }))
      );
    }
    fetchData();
  }, []);

  function uploadBusinessLicense(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result;
      setBusinessLicense(base64);
    };
  }
  function getCompanyInfo(e) {
    let value = e.target.value;
    console.log(value);
    getInfoCompany(value)
      .then((res) => {
        if (res) {
          console.log(res);
          setAddress(res.address);
          setOpenDate(res.openDate);
          setTaxCode(res.taxCode);
          setCompanyName(res.companyName);
          setCompanyPhone(res.companyPhone);
          setRepresentative(res.representative);
          setManagedBy(res.managedBy);
          setStatus(res.status);
          setEngName(res.engName);
          setSortName(res.sortName);
          setTypeOfBusiness(res.typeOfBusiness);
        }
        setErrors({ ...errors, taxCode: undefined });
      })
      .catch((e) => {
        setTaxCode("");
        setErrors({ ...errors, taxCode: "Kh??ng t??m th???y c??ng ty" });
      });
  }
  function onSubmitStep1(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Vui l??ng nh???p email";
      error = true;
    }
    if (email !== "" && !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errorObj.email = "Email kh??ng h???p l???";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Vui l??ng nh???p m???t kh???u";
      error = true;
    }
    if (confirmPassword === "") {
      errorObj.confirmPassword = "Vu?? l??ng nh???p l???i m???t kh???u";
      error = true;
    }
    if (password !== confirmPassword && confirmPassword !== "") {
      errorObj.confirmPassword = "M???t kh???u kh??ng kh???p";
      error = true;
    }
    if (name === "") {
      errorObj.name = "Vui l??ng nh???p t??n";
      error = true;
    }
    if (position === "") {
      errorObj.position = "Vui l??ng nh???p ch???c v???";
      error = true;
    }
    if (phone === "") {
      errorObj.phone = "Vui l??ng nh???p s??? ??i???n tho???i";
      error = true;
    }
    if (phone !== "" && !phone.match(/^[0-9]{10,11}$/)) {
      errorObj.phone = "S??? ??i???n tho???i kh??ng h???p l???";
      error = true;
    }
    setErrors(errorObj);
    if (!error) {
      setStep(2);
    }
  }

  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (companyType === "") {
      errorObj.companyType = "Vui l??ng nh???p lo???i h??nh c??ng ty";
      error = true;
    }
    console.log(field);
    if (field.length === 0) {
      errorObj.field = "Vui l??ng nh???p l??nh v???c ho???t ?????ng";
      error = true;
    }
    if (companyName === "") {
      errorObj.companyName = "Vui l??ng nh???p t??n c??ng ty";
      error = true;
    }
    if (address === "") {
      errorObj.address = "Vui l??ng nh???p ?????a ch???";
      error = true;
    }
    if (taxCode === "") {
      errorObj.taxCode = "Vui l??ng nh???p m?? s??? thu???";
      error = true;
    }
    if (mainIndustry === "") {
      errorObj.mainIndustry = "Vui l??ng nh???p ng??nh ngh??? ch??nh";
      error = true;
    }
    if (businessLicense === "") {
      errorObj.businessLicense = "Vui l??ng nh???p gi???y ph??p kinh doanh";
      error = true;
    }
    setErrors(errorObj);
    if (error) return;
    dispatch(loadingToggleAction(true));
    let data = {
      email,
      password,
      name,
      status,
      position,
      phone,
      companyType,
      field,
      companyName,
      address,
      username: taxCode,
      mainIndustry,
      businessLicense,
      engName,
      sortName,
      typeOfBusiness,
      openDate,
      companyPhone,
      representative,
      managedBy,
    };
    dispatch(companySignupAction(data, props.history));
  }
  return (
    <div className="page-wraper">
      <div className="browse-job login-style3">
        <div
          className="bg-img-fix"
          style={{ backgroundImage: `url(${bnr})`, minHeight: "100vh" }}
        >
          <div className="row mx-0">
            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 bg-white z-index2 relative p-a0 content-scroll skew-section left-bottom">
              <div className="login-form style-2">
                <div className="logo-header text-center p-tb30">
                  <Link to={"./"}>
                    <img src={require("./../../images/logo.png")} alt="" />
                  </Link>
                </div>
                <div className="clearfix"></div>
                <div className="tab-content nav p-b30 tab">
                  <div id="login" className="tab-pane active ">
                    {props.errorMessage && (
                      <div className="">{props.errorMessage}</div>
                    )}
                    {props.successMessage && (
                      <div className="">{props.successMessage}</div>
                    )}
                    <form className=" dez-form p-b30" onSubmit={onSignUp}>
                      <h3 className="form-title m-t0">Nh?? tuy???n d???ng</h3>
                      <div className="dez-separator-outer m-b5">
                        <div className="dez-separator bg-primary style-liner"></div>
                      </div>
                      <p>Vui l??ng cung c???p th??ng tin ch??nh x??c</p>
                      {step === 1 && (
                        <>
                          <div className="form-group">
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p h??? v?? t??n"
                            />
                            <div className="text-danger">
                              {errors.name && <div>{errors.name}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p ch???c v???"
                            />
                            <div className="text-danger">
                              {errors.position && <div>{errors.position}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p s??? ??i???n tho???i"
                            />
                            <div className="text-danger">
                              {errors.phone && <div>{errors.phone}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={email}
                              type="email"
                              onChange={(e) => setEmail(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p email"
                            />
                            <div className="text-danger">
                              {errors.email && <div>{errors.email}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={password}
                              className="form-control"
                              type="password"
                              placeholder="Nh???p m????t kh????u"
                              onChange={(e) => setPassword(e.target.value)}
                              minLength="6"
                            />
                            <div className="text-danger">
                              {errors.password && <div>{errors.password}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={confirmPassword}
                              className="form-control"
                              type="password"
                              placeholder="Nh???p l???i m????t kh????u"
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              minLength="6"
                            />
                            <div className="text-danger">
                              {errors.confirmPassword && (
                                <div>{errors.confirmPassword}</div>
                              )}
                            </div>
                          </div>
                          <div className="form-group text-right">
                            <button
                              type="button"
                              className="site-button dz-xs-flex m-r5 btn"
                              disabled={!name || !email || !password || !phone || !position }
                              onClick={onSubmitStep1}
                            >
                              Ti???p t???c{" "}
                              <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <div className="form-group">
                            <Select
                              placeholder="Ch???n lo???i h??nh c??ng ty"
                              onChange={(e) => setCompanyType(e.label)}
                              options={companyTypeOptions}
                            />
                            <div className="text-danger">
                              {errors.companyType && (
                                <div>{errors.companyType}</div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <Select
                              isMulti
                              closeMenuOnSelect={false}
                              placeholder="Ch???n l??nh v???c ho???t ?????ng"
                              onChange={(e) =>
                                setField(e.map((item) => item.label))
                              }
                              options={fieldOptions}
                            />
                            <div className="text-danger">
                              {errors.field && <div>{errors.field}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              name={taxCode}
                              onBlur={(e) => getCompanyInfo(e)}
                              className="form-control"
                              placeholder="Nh???p m?? s??? thu???"
                            />
                            <div className="text-danger">
                              {errors.taxCode && <div>{errors.taxCode}</div>}
                            </div>
                          </div>
                          {taxCode && (
                            <>
                              <div className="form-group">
                                <input
                                  value={companyName}
                                  className="form-control"
                                  onChange={() => {}}
                                />
                              </div>
                              <div className="form-group">
                                <input
                                  value={address}
                                  className="form-control"
                                  onChange={() => {}}
                                />
                              </div>
                            </>
                          )}
                          <div className="form-group">
                            <input
                              value={mainIndustry}
                              onChange={(e) => setMainIndustry(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p ng??nh ngh??? ch??nh"
                            />
                            <div className="text-danger">
                              {errors.mainIndustry && (
                                <div>{errors.mainIndustry}</div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={uploadBusinessLicense}
                            />
                            <div className="text-danger">
                              {errors.businessLicense && (
                                <div>{errors.businessLicense}</div>
                              )}
                            </div>
                          </div>

                          <div className="form-group text-left">
                            <span className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="check1"
                                checked={isAgree}
                                onChange={(e) => setIsAgree(e.target.checked)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="check1"
                              >
                                T??i ?????ng ?? v???i c??c ??i???u kho???n v?? ??i???u ki???n
                              </label>
                            </span>
                          </div>
                          {/* Next Step Button */}
                          <div className="form-group ">
                            <button
                              type="button"
                              className="site-button dz-xs-flex m-r5 "
                              onClick={() => setStep(1)}
                            >
                              <i
                                className="fa fa-arrow-left"
                                aria-hidden="true"
                              ></i>{" "}
                              Quay l???i
                            </button>
                            <button
                              type="submit"
                              className="site-button dz-xs-flex m-r5 float-right btn btn-lg"
                              disabled={!isAgree}
                            >
                              ????ng k??
                            </button>
                          </div>
                        </>
                      )}

                      <div className="dz-social clearfix d-none">
                        <h5 className="form-title m-t5 pull-left">
                          ????ng k?? v???i
                        </h5>
                        <ul className="dez-social-icon dez-border pull-right dez-social-icon-lg text-white">
                          <li>
                            <Link
                              to={""}
                              className="fa fa-facebook  fb-btn mr-1"
                              target="bank"
                            ></Link>
                          </li>
                          <li>
                            <Link
                              to={""}
                              className="fa fa-twitter  tw-btn mr-1"
                              target="bank"
                            ></Link>
                          </li>
                          <li>
                            <Link
                              to={""}
                              className="fa fa-linkedin link-btn mr-1"
                              target="bank"
                            ></Link>
                          </li>
                          <li>
                            <Link
                              to={""}
                              className="fa fa-google-plus  gplus-btn"
                              target="bank"
                            ></Link>
                          </li>
                        </ul>
                      </div>
                    </form>
                    {/* <div className="text-center bottom">
                      <Link
                        to="login"
                        className="site-button button-md btn-block text-white"
                      >
                        <i className="fa fa-user"></i> ????ng nh???p
                      </Link>
                    </div> */}
                  </div>
                </div>
                <div className="bottom-footer clearfix m-t10 m-b20 row text-center">
                  <div className="col-lg-12 text-center">
                    <span>
                      {" "}
                      ?? Copyright by{" "}
                      <i className="fa fa-heart m-lr5 text-red heart"></i>
                      <Link to={""}>CVIDPRO </Link> All rights reserved.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Register2);
