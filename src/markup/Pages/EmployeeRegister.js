import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Select from "react-select";
import {
  getListSchools,
  getListProvince,
  getListMajorByLevel,
  getListLevel,
  getListDistrict,
  getListWard,
  getListJobTitle,
} from "../../services/GetListService";
import {
  loadingToggleAction,
  employeeSignupAction,
} from "../../store/actions/AuthActions";
import ReactSelectShowType from "../../customComponents/ReactSelectShowType/ReactSelectShowType";

var bnr = require("./../../images/background/bg6.jpg");
function Register2(props) {
  let errorsObj = {
    name: "",
    username: "",
    birthday: "",
    gender: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    level: "",
    school: "",
    major: "",
    jobTitle: "",
    startYear: "",
    endYear: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [errors, setErrors] = useState(errorsObj);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [level, setLevel] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [levels, setLevels] = useState([]);
  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [isAgree, setIsAgree] = useState(false);
  const [step, setStep] = useState(1);
  const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "N???", label: "N???" },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      getListLevel().then((res) => {
        setLevels(res.data.map((item) => ({ value: item, label: item })));
      });
      getListSchools().then((res) => {
        setSchools(
          res.data.map((item) => ({ value: item._id, label: item.name }))
        );
      });
      getListProvince().then((res) => {
        setProvinces(res.data.map((item) => ({ value: item, label: item })));
      });
      getListJobTitle().then((res) => {
        setJobTitles(
          res.data.map((item) => ({ value: item.name, label: item.name }))
        );
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchDistrictAndWard() {
      if (province !== "") {
        let listDistrict = await getListDistrict(province);
        setDistricts(
          listDistrict.data.map((item) => ({ value: item, label: item }))
        );
      }
      if (district !== "") {
        let listWard = await getListWard(province, district);
        setWards(listWard.data.map((item) => ({ value: item, label: item })));
        setWard("");
      }
    }
    fetchDistrictAndWard();
  }, [province, district]);

  useEffect(() => {
    async function fetchSchoolAndMajor() {
      if (level !== "") {
        let listMajor = await getListMajorByLevel(level);
        setMajors(listMajor.data.map((item) => ({ value: item, label: item })));
        setMajor("");
      }
    }
    fetchSchoolAndMajor();
  }, [level]);
  function onSubmitStep1(e) {
    console.log("123");
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (name === "") {
      errorObj.name = "Vui l??ng nh???p t??n";
      error = true;
    }
    if (name !== "" && !name.includes(" ")) {
      errorObj.name = "Vui l??ng nh???p ?????y ????? h??? v?? t??n";
      error = true;
    }
    if (username === "") {
      errorObj.username = "Vui l??ng nh???p s??? ??i???n tho???i";
      error = true;
    }
    if (username !== "" && username.length !== 10) {
      errorObj.username = "S??? ??i???n tho???i kh??ng h???p l???";
      error = true;
    }
    if (birthday === "") {
      errorObj.birthday = "Vui l??ng nh???p ng??y sinh";
      error = true;
    }
    if (gender === "") {
      errorObj.gender = "Vui l??ng nh???p gi???i t??nh";
      error = true;
    }
    if (email === "") {
      errorObj.email = "Vui l??ng nh???p email";
      error = true;
    }
    if (email !== "" && !email.includes("@") && !email.includes(".")) {
      errorObj.email = "Email kh??ng h???p l???";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Vui l??ng nh???p m???t kh???u";
      error = true;
    }
    if (password !== "" && password.length < 6) {
      errorObj.password = "M???t kh???u ph???i c?? ??t nh???t 6 k?? t???";
      error = true;
    }
    if (password !== "" && password.length > 20) {
      errorObj.password = "M???t kh???u kh??ng ???????c qu?? 20 k?? t???";
      error = true;
    }
    if (confirmPassword === "") {
      errorObj.confirmPassword = "Vui l??ng nh???p l???i m???t kh???u";
      error = true;
    }
    if (confirmPassword !== "" && confirmPassword !== password) {
      errorObj.confirmPassword = "M???t kh???u kh??ng kh???p";
      error = true;
    }
    setErrors(errorObj);
    if (!error) {
      setStep(2);
    }
  }
  function onSubmitStep2(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (province === "") {
      errorObj.province = "Vui l??ng nh???p t???nh/th??nh ph???";
      error = true;
    }
    if (district === "") {
      errorObj.district = "Vui l??ng nh???p qu???n/huy???n";
      error = true;
    }
    if (ward === "") {
      errorObj.ward = "Vui l??ng nh???p ph?????ng/x??";
      error = true;
    }
    if (address === "") {
      errorObj.address = "Vui l??ng nh???p ?????a ch???";
      error = true;
    }
    setErrors(errorObj);
    if (!error) {
      setStep(3);
    }
  }
  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    // if (name === "") {
    //   errorObj.name = "Vui l??ng nh???p t??n";
    //   error = true;
    // }
    // if (name !== "" && !name.includes(" ")) {
    //   errorObj.name = "Vui l??ng nh???p ?????y ????? h??? v?? t??n";
    //   error = true;
    // }
    // if (username === "") {
    //   errorObj.username = "Vui l??ng nh???p s??? ??i???n tho???i";
    //   error = true;
    // }
    // if (username !== "" && username.length !== 10) {
    //   errorObj.username = "S??? ??i???n tho???i kh??ng h???p l???";
    //   error = true;
    // }
    // if (birthday === "") {
    //   errorObj.birthday = "Vui l??ng nh???p ng??y sinh";
    //   error = true;
    // }
    // if (gender === "") {
    //   errorObj.gender = "Vui l??ng nh???p gi???i t??nh";
    //   error = true;
    // }
    // if (province === "") {
    //   errorObj.province = "Vui l??ng nh???p t???nh/th??nh ph???";
    //   error = true;
    // }
    // if (district === "") {
    //   errorObj.district = "Vui l??ng nh???p qu???n/huy???n";
    //   error = true;
    // }
    // if (ward === "") {
    //   errorObj.ward = "Vui l??ng nh???p ph?????ng/x??";
    //   error = true;
    // }
    // if (address === "") {
    //   errorObj.address = "Vui l??ng nh???p ?????a ch???";
    //   error = true;
    // }
    if (level === "") {
      errorObj.level = "Vui l??ng nh???p tr??nh ?????";
      error = true;
    }
    if (school === "") {
      errorObj.school = "Vui l??ng nh???p tr?????ng";
      error = true;
    }
    if (major === "") {
      errorObj.major = "Vui l??ng nh???p chuy??n ng??nh";
      error = true;
    }
    if (jobTitle === "") {
      errorObj.jobTitle = "Vui l??ng nh???p ch???c danh";
      error = true;
    }
    if (startYear === "") {
      errorObj.startYear = "Vui l??ng nh???p n??m b???t ?????u";
      error = true;
    }
    if (endYear === "") {
      errorObj.endYear = "Vui l??ng nh???p n??m k???t th??c";
      error = true;
    }
    // if (email === "") {
    //   errorObj.email = "Vui l??ng nh???p email";
    //   error = true;
    // }
    // if (email !== "" && !email.includes("@") && !email.includes(".")) {
    //   errorObj.email = "Email kh??ng h???p l???";
    //   error = true;
    // }
    // if (password === "") {
    //   errorObj.password = "Vui l??ng nh???p m???t kh???u";
    //   error = true;
    // }
    // if (password !== "" && password.length < 6) {
    //   errorObj.password = "M???t kh???u ph???i c?? ??t nh???t 6 k?? t???";
    //   error = true;
    // }
    // if (password !== "" && password.length > 20) {
    //   errorObj.password = "M???t kh???u kh??ng ???????c qu?? 20 k?? t???";
    //   error = true;
    // }
    // if (confirmPassword === "") {
    //   errorObj.confirmPassword = "Vui l??ng nh???p l???i m???t kh???u";
    //   error = true;
    // }
    // if (confirmPassword !== "" && confirmPassword !== password) {
    //   errorObj.confirmPassword = "M???t kh???u kh??ng kh???p";
    //   error = true;
    // }
    setErrors(errorObj);
    if (error) return;
    dispatch(loadingToggleAction(true));
    let data = {
      name,
      username,
      birthday,
      gender,
      province,
      district,
      ward,
      address,
      level,
      school,
      major,
      jobTitle,
      startYear,
      endYear,
      email,
      password,
    };
    dispatch(employeeSignupAction(data, props.history));
  }

  return (
    <div className="page-wraper">
      <div className="browse-job login-style3">
        <div className="bg-img-fix" style={{ backgroundImage: `url(${bnr})` }}>
          <div className="row mx-0">
            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 bg-white z-index2 relative p-a0 content-scroll skew-section left-bottom">
              <div className="login-form style-2">
                <div className="logo-header text-center p-tb30">
                  <Link to={"./"}>
                    <h1 className="m-b0">CVIDPRO</h1>
                    {/* <img src={require("./../../images/logo.png")} alt="" /> */}
                  </Link>
                </div>
                <div className="clearfix"></div>
                <div className="tab-content nav p-b30 tab">
                  <div id="login" className="tab-pane active">
                    {props.errorMessage && (
                      <div className="">{props.errorMessage}</div>
                    )}
                    {props.successMessage && (
                      <div className="">{props.successMessage}</div>
                    )}
                    <form className=" dez-form p-b30 mx-4" onSubmit={onSignUp}>
                      <h3 className="form-title m-t0">
                        ????ng k?? ng?????i t??m vi???c
                      </h3>
                      <div className="dez-separator-outer m-b5">
                        <div className="dez-separator bg-primary style-liner"></div>
                      </div>
                      <p>Vui l??ng nh???p ch??nh x??c th??ng tin</p>
                      {step === 1 && (
                        <>
                          <div className="form-group">
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="form-control small"
                              placeholder="Nh???p h??? v?? t??n"
                            />
                            <div className="text-danger">
                              {errors.name && <div>{errors.name}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              value={username}
                              text="text"
                              onChange={(e) => setUsername(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p s??? ??i???n tho???i"
                            />
                            <div className="text-danger">
                              {errors.username && <div>{errors.username}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="date"
                              value={birthday}
                              onChange={(e) => setBirthday(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p ng??y sinh"
                            />
                            <div className="text-danger">
                              {errors.birthday && <div>{errors.birthday}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <Select
                              placeholder="Ch???n gi???i t??nh"
                              onChange={(e) => setGender(e.label)}
                              options={genderOptions}
                            />
                            <div className="text-danger">
                              {errors.gender && <div>{errors.gender}</div>}
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
                              type="password"
                              value={password}
                              className="form-control"
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Nh???p m???t kh???u"
                            />
                            <div className="text-danger">
                              {errors.password && <div>{errors.password}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              value={confirmPassword}
                              className="form-control"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Nh???p l???i m???t kh???u"
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
                              disabled={
                                !name ||
                                !username ||
                                !password ||
                                !confirmPassword ||
                                !email ||
                                !birthday ||
                                !gender
                              }
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
                            {/* <Select
                              placeholder='Ch???n t???nh/th??nh ph???'
                              onChange={(e) => setProvince(e.label)}
                              options={provinces}
                            /> */}
                            <ReactSelectShowType
                              placeholder="Ch???n t???nh/th??nh ph???"
                              onChange={(e) => setProvince(e.label)}
                              options={provinces}
                              minInput={1}
                            />
                            <div className="text-danger">
                              {errors.province && <div>{errors.province}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            {/* <Select
                              placeholder='Ch???n qu???n/huy???n'
                              onChange={(e) => setDistrict(e.label)}
                              options={districts}
                            /> */}
                            <ReactSelectShowType
                              placeholder="Ch???n qu???n/huy???n"
                              onChange={(e) => setDistrict(e.label)}
                              options={districts}
                              minInput={1}
                            />
                            <div className="text-danger">
                              {errors.district && <div>{errors.district}</div>}
                            </div>
                          </div>

                          <div className="form-group">
                            <ReactSelectShowType
                              placeholder="Ch???n ph?????ng/x??"
                              onChange={(e) => setWard(e.label)}
                              options={wards}
                              minInput={1}
                            />
                            {/* <Select
                              defaultValue=''
                              placeholder='Ch???n ph?????ng/x??'
                              onChange={(e) => setWard(e.label)}
                              options={wards}
                            /> */}
                            <div className="text-danger">
                              {errors.ward && <div>{errors.ward}</div>}
                            </div>
                          </div>

                          <div className="form-group">
                            <input
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p ?????a ch???"
                            />
                            <div className="text-danger">
                              {errors.address && <div>{errors.address}</div>}
                            </div>
                          </div>
                          <div className="form-group text-right">
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
                              type="button"
                              className="site-button dz-xs-flex m-r5 btn"
                              disabled={
                                !province || !district || !ward || !address
                              }
                              onClick={onSubmitStep2}
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
                      {step === 3 && (
                        <>
                          <div className="form-group">
                            <Select
                              placeholder="Ch???n tr??nh ?????"
                              onChange={(e) => setLevel(e.label)}
                              options={levels}
                            />
                            <div className="text-danger">
                              {errors.level && <div>{errors.level}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <ReactSelectShowType
                              placeholder="Ch???n tr?????ng"
                              onChange={(e) => setSchool(e.label)}
                              options={schools}
                              minInput={1}
                            />
                            {/* <Select
                              placeholder='Ch???n tr?????ng'
                              onChange={(e) => setSchool(e.label)}
                              options={schools}
                            /> */}
                            <div className="text-danger">
                              {errors.school && <div>{errors.school}</div>}
                            </div>
                          </div>

                          <div className="form-group">
                            <ReactSelectShowType
                              minInput={1}
                              placeholder="Ch???n ng??nh"
                              onChange={(e) => setMajor(e.label)}
                              options={majors}
                            />
                            {/* <Select
                              placeholder='Ch???n ng??nh'
                              onChange={(e) => setMajor(e.label)}
                              options={majors}
                            /> */}
                            <div className="text-danger">
                              {errors.major && <div>{errors.major}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <ReactSelectShowType
                              minInput={1}
                              placeholder="Ch???n ch???c danh"
                              onChange={(e) => setJobTitle(e.label)}
                              options={jobTitles}
                            />
                            {/* <Select
                              placeholder='Ch???n ch???c danh'
                              onChange={(e) => setJobTitle(e.label)}
                              options={jobTitles}
                            /> */}
                            <div className="text-danger">
                              {errors.jobTitle && <div>{errors.jobTitle}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="month"
                              value={startYear}
                              onChange={(e) => setStartYear(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p n??m b???t ?????u"
                            />
                            <div className="text-danger">
                              {errors.startYear && (
                                <div>{errors.startYear}</div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="month"
                              value={endYear}
                              onChange={(e) => setEndYear(e.target.value)}
                              className="form-control"
                              placeholder="Nh???p n??m k???t th??c"
                            />
                            <div className="text-danger">
                              {errors.endYear && <div>{errors.endYear}</div>}
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
                          <div className="form-group text-right">
                            <button
                              type="button"
                              className="site-button dz-xs-flex m-r5 "
                              onClick={() => setStep(2)}
                            >
                              <i
                                className="fa fa-arrow-left"
                                aria-hidden="true"
                              ></i>{" "}
                              Quay l???i
                            </button>
                            <button
                              type="submit"
                              className="site-button dz-xs-flex m-r5 btn"
                              disabled={
                                !isAgree ||
                                !level ||
                                !school ||
                                !major ||
                                !jobTitle ||
                                !startYear ||
                                !endYear
                              }
                            >
                              ????ng k??
                            </button>
                          </div>
                        </>
                      )}

                      <div className="dz-social clearfix d-none">
                        <h5 className="form-title m-t5 pull-left">
                          Sign In With
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
