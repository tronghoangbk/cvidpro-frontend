import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import swal from "sweetalert";
import {
  Modal,
  Button,
  Accordion,
  Form,
  Nav,
  Card,
  InputGroup,
  FormControl,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import "../../css/mycv.css"
import Select from "react-select";
import {
  getMyResume,
  addSchool,
  deleteSchool,
  sendOTP,
  confirmPhone,
  addShortTraining,
  deleteShortTraining,
  addWorkExperience,
  deleteWorkExperience,
  updatePoint,
} from "../../services/EmployeeApi";
import {
  getSortTime,
  formatTimeInput,
  getMonthYear,
  formatMonthInput,
} from "../../services/TimeService";
import Listingsidebar from "../Element/Listingsidebar";
import {
  getListLevel,
  getListSchools,
  getAllListMajor,
  getListQuestion,
  getListJobTitle,
  getListLanguage,
  getCertificateByLanguage,
} from "../../services/GetListService";
var bnr2 = require("./../../images/banner/bnr1.jpg");
var bnr = require("./../../images/background/bg3.jpg");
function Jobmyresume(props) {
  const objSchool = {
    school: "",
    major: "",
    level: "",
    start: "",
    end: "",
    jobTitle: "",
  };
  const objShortTraining = {
    start: "",
    end: "",
    organization: "",
    certificate: "",
  };
  const objWork = {
    company: "",
    address: "",
    process: [],
    start: "",
    end: "",
    leaving: "",
    isWorking: true,
    isCurrent: false,
  };
  const objProcess = {
    jobTitle: "",
    from: "",
    to: "",
    isCurrent: false,
    major: "",
    address: "",
    result: "",
    workDescription: "",
  };
  const objNotWork = {
    start: "",
    end: "",
    process: [],
    isWorking: false,
    isCurrent: false,
  };

  const languageCertificate = {
    language: "",
    name: "",
    startTime: "",
    endTime: "",
    point: "",
    organizer: "",
  };

  // option l?? do ngh??? vi???c
  const listLeaving = [
    { value: "Ngh??? theo mong mu???n", label: "Ngh??? theo mong mu???n" },
    { value: "Ngh??? theo y??u c???u", label: "Ngh??? theo y??u c???u" },
    { value: "T??? ngh???", label: "T??? ngh???" },
  ];

  const resultOption = [
    { value: "Tr??n m???c ????? ra", label: "Tr??n m???c ????? ra" },
    { value: "?????t m???c ????? ra", label: "?????t m???c ????? ra" },
    { value: "D?????i m???c ????? ra", label: "D?????i m???c ????? ra" },
  ];

  const getValueSelect = (value) => {
    return value ? { label: value, value: value } : "";
  };

  const [userInformation, setUserInformation] = useState({});
  const [reload, setReload] = useState(false);
  const [levels, setLevels] = useState([]);
  const [majors, setMajors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [jobTitleOption, setJobTitleOption] = useState([]);
  const [languageOption, setLanguageOption] = useState([]);
  const [certificateOption, setCertificateOption] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [newSchool, setNewSchool] = useState(objSchool);
  const [newWork, setNewWork] = useState(objWork);
  const [newNotWork, setNewNotWork] = useState(objNotWork);
  const [newProcess, setNewProcess] = useState(objProcess);
  const [tabKey, setTabKey] = useState("working");

  const [newShortTraining, setNewShortTraining] = useState(objShortTraining);
  const [newLanguageCertificate, setNewLanguageCertificate] =
    useState(languageCertificate);

  const [schools, setSchools] = useState([]);
  const [basicdetails, setBasicDetails] = useState(false);
  const [resume, setResume] = useState(false);
  const [education, setEducation] = useState(false);
  const [showModalConfirmPhone, setShowModalConfirmPhone] = useState(false);
  const [showShortTraining, setShowShortTraining] = useState(false);
  const [showLanguageCertification, setShowLanguageCertification] =
    useState(false);
  const [itskills, setItSkills] = useState(false);
  const [otherSkill, setOtherSkill] = useState(false);

  const [countDown, setCountDown] = useState(60);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    async function fetchData() {
      getListLevel().then((res) => {
        setLevels(res.data.map((item) => ({ value: item, label: item })));
      });
      getListSchools().then((res) => {
        setSchools(
          res.data.map((item) => ({ value: item.name, label: item.name }))
        );
      });
      getAllListMajor().then((res) => {
        setMajors(res.data.map((item) => ({ value: item, label: item })));
      });

      getListQuestion().then((res) => {
        setQuestions(res.data);
      });

      getListJobTitle().then((res) => {
        setJobTitleOption(
          res.data.map((item) => ({ value: item.name, label: item.name }))
        );
      });
      getListLanguage().then((res) => {
        setLanguageOption(res.map((item) => ({ value: item, label: item })));
      });
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      const response = await getMyResume(props.history);
      setUserInformation(response);
      objProcess.jobTitle = response.jobTitle;
      objProcess.major = response.major;
      if (response.workExperience.length > 0) {
        let lastWork =
          response.workExperience[response.workExperience.length - 1];
        objProcess.from = lastWork.end;
        setNewNotWork({ ...objNotWork, start: lastWork.end });
      }
      setNewProcess(objProcess);
    }
    fetchData();
  }, [reload]);

  useEffect(() => {
    if (newLanguageCertificate.language) {
      getCertificateByLanguage(newLanguageCertificate.language).then((res) => {
        console.log(res);
        setCertificateOption(
          res.map((item) => ({ value: item.name, label: item.name }))
        );
      });
    }
  }, [newLanguageCertificate.language]);
  function handleSendOTP() {
    let timeWait = 10;
    sendOTP(userInformation._id, userInformation.username).then((res) => {
      if (res) {
        setShowModalConfirmPhone(true);
        setCountDown(timeWait);
        let interval = setInterval(() => {
          timeWait -= 1;
          setCountDown(timeWait);
          if (timeWait === 0) {
            clearInterval(interval);
          }
        }, 1000);
      }
    });
  }
  function handleConfirmPhone() {
    confirmPhone(userInformation._id, otp).then((res) => {
      if (res) {
        setShowModalConfirmPhone(false);
        setReload(!reload);
      }
      // on to top page after confirm phone number success
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });
  }
  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result;
      setUserInformation({ ...userInformation, avatar: base64 });
    };
  };
  const handleUpdatePoint = async (e) => {
    e.preventDefault();
    updatePoint(userInformation._id, userInformation.pointList).then((res) => {
      if (res) {
        setReload(!reload);
      }
    });
  };

  const handleAddSchool = async () => {
    await addSchool(userInformation._id, newSchool);
    setNewSchool(objSchool);
    setEducation(false);
    setReload(!reload);
  };
  const handleDeleteSchool = async (id) => {
    await deleteSchool(userInformation._id, id);
    setReload(!reload);
  };

  const handleAddShortTraining = async () => {
    console.log(newShortTraining);
    await addShortTraining(userInformation._id, newShortTraining);
    setShowShortTraining(false);
    setNewShortTraining(objShortTraining);
    setReload(!reload);
  };
  const handleDeleteShortTraining = async (id) => {
    console.log(id);
    await deleteShortTraining(userInformation._id, id);
    setReload(!reload);
  };

  const handleAddProcess = async (e) => {
    if (
      (!newProcess.to && !newProcess.isCurrent) ||
      !newProcess.from ||
      !newProcess.jobTitle ||
      !newProcess.major ||
      !newProcess.workDescription ||
      !newProcess.address ||
      (!newProcess.isCurrent && !newProcess.result)
    ) {
      swal("Alert!", "Vui l??ng nh???p ?????y ????? th??ng tin", "error");
      return;
    }
    let listProcess = newWork.process;
    if (
      newWork.process.length > 0 &&
      newWork.process[newWork.process.length - 1].isCurrent === true
    ) {
      swal("Alert!", "Th???i gian ???? ?????n hi???n t???i", "error");
    }
    listProcess.push(newProcess);
    setNewWork({ ...newWork, process: listProcess });
    objProcess.jobTitle = userInformation.jobTitle;
    objProcess.major = userInformation.major;
    setNewProcess({ ...objProcess, from: newProcess.to });
  };

  const handleDeleteProcess = async (index) => {};

  const handleAddWorkExperience = async () => {
    if (userInformation.workExperience.length > 0) {
      let lastWork =
        userInformation.workExperience[
          userInformation.workExperience.length - 1
        ];
      if (lastWork.isCurrent === true) {
        swal("Alert!", "Th???i gian nh???p ???? ?????n th???i ??i???m hi???n t???i", "error");
        return;
      }
    }
    if (
      !newWork.company ||
      !newWork.address ||
      newWork.process.length === 0 ||
      (!newWork.leaving && !newWork.isCurrent)
    ) {
      swal("Alert!", "Vui l??ng nh???p ?????y ????? th??ng tin", "error");
      return;
    }
    console.log(newWork);
    setNewWork({
      ...newWork,
      start: newWork.process[0].from,
      end: newWork.process[newWork.process.length - 1].to,
      isCurrent: newWork.process[newWork.process.length - 1].isCurrent,
    });
    setNewNotWork({ ...newNotWork, start: newWork.process[0].from });
    setUserInformation({
      ...userInformation,
      workExperience: [...userInformation.workExperience, newWork],
    });
    await addWorkExperience(userInformation._id, newWork);
    objProcess.jobTitle = userInformation.jobTitle;
    objProcess.major = userInformation.major;
    setNewWork(objWork);
    setNewProcess({ objProcess });
    setReload(!reload);
  };
  const handleAddNotWork = async () => {
    if (userInformation.workExperience.length > 0) {
      let lastWork =
        userInformation.workExperience[
          userInformation.workExperience.length - 1
        ];
      if (lastWork.isCurrent === true) {
        swal("Alert!", "Th???i gian nh???p ???? ?????n th???i ??i???m hi???n t???i", "error");
        return;
      }
    }
    if (!newNotWork.start || (!newNotWork.end && !newNotWork.isCurrent)) {
      swal("Alert!", "Vui l??ng nh???p ?????y ????? th??ng tin", "error");
      return;
    }
    setUserInformation({
      ...userInformation,
      workExperience: [...userInformation.workExperience, newNotWork],
    });
    await addWorkExperience(userInformation._id, newNotWork);
    setNewNotWork(objNotWork);
    // setReload(!reload);
  };
  const handleDeleteWorkExperience = async (id) => {
    await deleteWorkExperience(userInformation._id, id);
    setReload(!reload);
  };

  const getExperience = (workExperience) => {
    let year = 0;
    let month = 0;
    if (!workExperience) {
      return "Ch??a c?? kinh nghi???m";
    }
    workExperience.forEach((company) => {
      company.process.forEach((process) => {
        if (process.isCurrent === true) {
          let to = new Date();
          let from = new Date(process.from);
          let diff = to.getTime() - from.getTime();
          month += Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        } else {
          let to = new Date(process.to);
          let from = new Date(process.from);
          let diff = to.getTime() - from.getTime();
          month += Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        }
      });
    });
    if (month >= 12) {
      year += Math.floor(month / 12);
      month = month % 12;
    }
    return `${year} n??m ${month} th??ng`;
  };

  return (
    <>
      {/* <Header /> */}
      <div className="page-content">
        <div
          className="overlay-black-dark profile-edit p-t50 p-b20"
          style={{ backgroundImage: "url(" + bnr + ")" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-7 candidate-info">
                <div className="candidate-detail">
                  <div className="canditate-des text-center">
                    <Link to={"#"}>
                      <img alt="" src={`${userInformation.avatar}`} />
                    </Link>
                    <div
                      className="upload-link"
                      title="update"
                      data-toggle="tooltip"
                      data-placement="right"
                    >
                      <input
                        type="file"
                        className="update-flie"
                        accept="image/*"
                        onChange={uploadAvatar}
                      />
                      <i className="fa fa-camera"></i>
                    </div>
                  </div>
                  <div className="text-white browse-job text-left">
                    <h4 className="m-b0">
                      {userInformation?.name}
                      <Link
                        to={"#"}
                        onClick={() => setBasicDetails(true)}
                        className="m-l15 font-16 text-white"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                    </h4>
                    <p className="m-b15">{userInformation.jobTitle}</p>
                    <ul className="clearfix">
                      <li>
                        <i className="ti-calendar"></i>{" "}
                        {getSortTime(userInformation.birthday)}
                      </li>
                      <li>
                        <i className="ti-user"></i> {userInformation.gender}
                      </li>
                      <li>
                        <i className="ti-mobile"></i> {userInformation.username}
                      </li>
                      <li>
                        <i className="ti-agenda"></i> {userInformation.level}
                      </li>
                      <li className="w-100">
                        <i className="ti-briefcase"></i>{" "}
                        {userInformation.school}
                      </li>
                      <br />
                      <li className="w-100">
                        <i className="ti-id-badge"></i> {userInformation.major}
                      </li>
                      <br />
                      <li className="w-100">
                        <i className="ti-location-pin"></i>{" "}
                        {userInformation.address +
                          ", " +
                          userInformation.ward +
                          ", " +
                          userInformation.district +
                          ", " +
                          userInformation.province}
                      </li>
                      <li className="w-100">
                        <i className="ti-email"></i> {userInformation.email}
                      </li>
                    </ul>
                    <div className="progress-box m-t10">
                      <div className="progress-info"  width="10000px" height="500px"   >
                        ??i???m CV:
                        <span className="score-progcess">{userInformation.points}</span>
                      </div>
                      <div className="progress" >
                        <div
                          className="progress-bar bg-primary"  
                          style={{ width: userInformation.points * 10 + "%" }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-5">
                <Link to={"#"}>
                  <div className="pending-info text-white p-a25">
                    <h5>Tr???ng th??i CVID</h5>
                    <ul className="list-check secondry">
                      {userInformation.confirmEmail && (
                        <li>???? x??c th???c E-mail</li>
                      )}
                      {userInformation.confirmPhone ? (
                        <>
                          {" "}
                          <li>???? x??c th???c s??? ??i???n tho???i</li>
                          {userInformation.confirm1?.confirmed === -1 ? (
                            <li>CV kh??ng ???????c duy???t</li>
                          ) : userInformation.confirm2?.confirmed === 0 ? (
                            <li>CV ??ang ch??? duy???t</li>
                          ) : (
                            <li>CV ???? ???????c duy???t</li>
                          )}
                        </>
                      ) : (
                        <li onClick={handleSendOTP}>
                          Ch??a x??c th???c s??? ??i???n tho???i
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Modal
            className="modal fade browse-job modal-bx-info editor"
            show={showModalConfirmPhone}
            onHide={() => setShowModalConfirmPhone(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>X??c th???c s??? ??i???n tho???i</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="phone">S??? ??i???n tho???i</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Nh???p s??? ??i???n tho???i"
                  value={userInformation.username}
                  disabled
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Nh???p m?? x??c th???c"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSendOTP}
                    disabled={countDown !== 0}
                  >
                    {countDown === 0 ? "G???i l???i" : "00 : " + countDown}
                  </button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModalConfirmPhone(false)}
              >
                ????ng
              </Button>
              <Button
                variant="primary"
                disabled={otp.length !== 6}
                onClick={handleConfirmPhone}
              >
                X??c th???c
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            className="modal fade browse-job modal-bx-info editor"
            show={basicdetails}
            onHide={setBasicDetails}
          >
            <div className="modal-dialog my-0" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ProfilenameModalLongTitle">
                    Th??ng tin c?? b???n
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setBasicDetails(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>H??? v?? t??n</label>
                          <input
                            type="text"
                            value={userInformation.name}
                            className="form-control"
                            placeholder="Nh???p h??? v?? t??n"
                            onChange={(e) => {
                              setUserInformation({
                                ...userInformation,
                                name: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label className="m-b0">Gi???i t??nh</label>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div
                                className="custom-control custom-radio"
                                onClick={() => {
                                  setUserInformation({
                                    ...userInformation,
                                    gender: "Nam",
                                  });
                                }}
                              >
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  checked={userInformation.gender === "Nam"}
                                />
                                <label className="custom-control-label">
                                  Nam
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div
                                className="custom-control custom-radio"
                                onClick={() => {
                                  setUserInformation({
                                    ...userInformation,
                                    gender: "N???",
                                  });
                                }}
                              >
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  checked={userInformation.gender === "N???"}
                                />
                                <label className="custom-control-label">
                                  N???
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>S??? ??i???n tho???i</label>
                          <input
                            type="text"
                            value={userInformation.username}
                            className="form-control"
                            placeholder="Nh???p s??? ??i???n tho???i"
                            onChange={(e) => {
                              setUserInformation({
                                ...userInformation,
                                username: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Ng??y sinh</label>
                          <input
                            type="date"
                            value={formatTimeInput(userInformation.birthday)}
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                            onChange={(e) => {
                              setUserInformation({
                                ...userInformation,
                                birthday: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Email Address</label>
                          <h6 className="m-a0 font-14">
                            {userInformation.email}
                          </h6>
                          <Link to={"#"}>Change Email Address</Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="site-button"
                    onClick={() => setBasicDetails(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="site-button">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <div className="content-block">
          <div className="section-full browse-job content-inner-2">
            <div className="container">
              <div
                id="resume_headline_bx"
                className=" job-bx bg-white table-job-bx m-b30"
              >
                <div className="d-flex">
                  <h5 className="m-b15 bold">Kinh nghi???m l??m vi???c</h5>
                </div>
                {userInformation.workExperience?.map((item, index1) => {
                  return (
                    <>
                      {item?.isWorking ? (
                        <Form className="mb-3">
                          <Card>
                            <Card.Header>
                              <Card.Title className="header-cv" style={{maxHeight:"200px"}}>
                                Th???i gian l??m vi???c
                              </Card.Title>
                              <div className="row">
                                <div className="col-12" >
                                  <InputGroup size="sm" className="mb-2">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "50px" }}
                                    >
                                      <InputGroup.Text className="title-cv">
                                        N??i l??m vi???c
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                      value={item.company}
                                      className="answer"
                                      style={{ maxHeight: "38px" }} 
                                    />
                                  </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <InputGroup size="sm" className="mb-2">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "38px" }}
                                    >
                                      <InputGroup.Text className="title-cv">T???</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className="answer"
                                      value={formatMonthInput(item.start)}
                                      style={{ maxHeight: "38px" }}
                                      type="month"
                                    />
                                  </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <InputGroup size="sm">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "38px" }}
                                    >
                                      <InputGroup.Text className="title-cv">?????n</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className="answer"
                                      style={{ maxHeight: "38px" }}
                                      type="month"
                                      value={formatMonthInput(item.end)}
                                    />
                                  </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="my-2"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="Hi???n t???i"
                                      checked={item.isCurrent}
                                    />
                                  </Form.Group>
                                </div>
                                <div className="col-12">
                                  <InputGroup size="sm">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "38px" }}
                                    >
                                      <InputGroup.Text className="title-cv">?????a ch???</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className="answer"
                                      style={{ maxHeight: "38px" }}
                                      value={item.address}
                                    />
                                  </InputGroup>
                                </div>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Card.Title className="header-cv">
                                Qu?? tr??nh l??m vi???c
                              </Card.Title>
                              {item.process.map((element, index2) => {
                                return (
                                  <>
                                    <div className="row ">
                                      <div className="col-md-4 col-sm-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              T???
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            className="answer"
                                            style={{ maxHeight: "38px" }}
                                            type="month"
                                            value={formatMonthInput(
                                              element.from
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-md-4 col-sm-12">
                                        <InputGroup size="sm">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              ?????n
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            className="answer"
                                            style={{ maxHeight: "38px" }}
                                            type="month"
                                            value={formatMonthInput(element.to)}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-md-4 col-sm-12">
                                        <Form.Group
                                          controlId="formBasicCheckbox"
                                          className="my-2"
                                        >
                                          <Form.Check
                                            type="checkbox"
                                            label="Hi???n t???i"
                                            checked={element.isCurrent}
                                          />
                                        </Form.Group>
                                      </div>
                                      <div className="col-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              C??ng vi???c
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            className="answer"
                                            style={{ maxHeight: "38px" }}
                                            value={element.workDescription}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              Chuy??n ngh??nh
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            as={Select}
                                            size="sm"
                                            className="answer"
                                            options={majors}
                                            value={getValueSelect(
                                              element.major
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              Ch???c danh c??ng vi???c
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            as={Select}
                                            size="sm"
                                            className="answer"
                                            options={jobTitleOption}
                                            value={getValueSelect(
                                              element.jobTitle
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              ?????a ch???
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            className="answer"
                                            style={{ maxHeight: "38px" }}
                                            value={element.address}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="col-12">
                                        <InputGroup size="sm" className="mb-2">
                                          <InputGroup.Prepend
                                            style={{ maxHeight: "38px" }}
                                          >
                                            <InputGroup.Text className="title-cv">
                                              K???t qu???
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            as={Select}
                                            size="sm"
                                            className="answer"
                                            options={resultOption}
                                            value={getValueSelect(
                                              element.result
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </Card.Body>
                            <Card.Footer>
                              <InputGroup size="sm">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">Ngh??? vi???c</InputGroup.Text>
                                </InputGroup.Prepend>

                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="answer"
                                  options={listLeaving}
                                  value={getValueSelect(item.leaving)}
                                ></FormControl>
                              </InputGroup>
                            </Card.Footer>
                          </Card>
                        </Form>
                      ) : (
                        <Form className="mb-3">
                          <Card>
                            <Card.Header>
                              <Card.Title className="text-center">
                                Th???i gian kh??ng l??m vi???c
                              </Card.Title>
                              <div className="row">
                                <div className="col-md-4 col-sm-12">
                                  <InputGroup size="sm" className="mb-2">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "38px" }}
                                    >
                                      <InputGroup.Text className="title-cv">T???</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className="answer"
                                      value={formatMonthInput(item.start)}
                                      style={{ maxHeight: "38px" }}
                                      type="month"
                                    />
                                  </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <InputGroup size="sm">
                                    <InputGroup.Prepend
                                      style={{ maxHeight: "38px" }}
                                    >
                                      <InputGroup.Text className="title-cv">?????n</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                      className="answer"
                                      style={{ maxHeight: "38px" }}
                                      type="month"
                                      value={formatMonthInput(item.end)}
                                    />
                                  </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="my-2"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="Hi???n t???i"
                                      checked={item.isCurrent}
                                    />
                                  </Form.Group>
                                </div>
                             
                              </div>
                            </Card.Header>
                          </Card>
                        </Form>
                      )}
                    </>
                  );
                })}
                <h5 className="">
                  Kinh nghi???m ?????n hi???n t???i:{" "}
                  {getExperience(userInformation.workExperience)}
                </h5>
                <h5 className="text-center">Th??m kinh nghi???m l??m vi???c m???i</h5>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={tabKey}
                  onSelect={(k) => setTabKey(k)}
                >
                  <Tab eventKey="working" title="Th??m n??i l??m vi???c">
                    <Form className="mb-2" action="javascript:void(0);">
                      <Card>
                        <Card.Header>
                          <div className="row">
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">
                                    N??i l??m vi???c
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  value={newWork.company}
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  onChange={(e) => {
                                    setNewWork({
                                      ...newWork,
                                      company: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">T???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  value={formatMonthInput(
                                    newWork.process[0]?.from
                                  )}
                                  style={{ maxHeight: "38px" }}
                                  type="month"
                                  disabled={true}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">?????n</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  type="month"
                                  value={formatMonthInput(
                                    newWork.process[newWork.process.length - 1]
                                      ?.to
                                  )}
                                  disabled={true}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="my-2"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Hi???n t???i"
                                  checked={
                                    newWork.process.length > 0 &&
                                    newWork.process[newWork.process.length - 1]
                                      .isCurrent === true
                                      ? true
                                      : false
                                  }
                                  disabled={true}
                                />
                              </Form.Group>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">?????a ch???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  value={newWork.address}
                                  onChange={(e) => {
                                    setNewWork({
                                      ...newWork,
                                      address: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Card.Title className="header-cv">
                            Qu?? tr??nh l??m vi???c
                          </Card.Title>
                          {newWork.process.map((element, index2) => {
                            return (
                              <>
                                <div className="row mt-3">
                                  <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">T???</InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        className="answer"
                                        style={{ maxHeight: "38px" }}
                                        type="month"
                                        value={formatMonthInput(element.from)}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">?????n</InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        className="answer"
                                        style={{ maxHeight: "38px" }}
                                        type="month"
                                        value={formatMonthInput(element.to)}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-md-4 col-sm-12">
                                    <Form.Group
                                      controlId="formBasicCheckbox"
                                      className="my-2"
                                    >
                                      <Form.Check
                                        type="checkbox"
                                        label="Hi???n t???i"
                                        checked={element.isCurrent}
                                        onChange={(e) => {
                                          let temp = newWork.process;
                                          temp[index2].isCurrent =
                                            e.target.checked;
                                          setNewWork({
                                            ...newWork,
                                            process: temp,
                                          });
                                        }}
                                      />
                                    </Form.Group>
                                  </div>
                                  <div className="col-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">
                                          C??ng vi???c
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        className="answer"
                                        style={{ maxHeight: "38px" }}
                                        value={element.workDescription}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">
                                          Chuy??n ngh??nh
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        as={Select}
                                        size="sm"
                                        className="answer"
                                        options={majors}
                                        value={getValueSelect(element.major)}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">
                                          Ch???c danh c??ng vi???c
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        as={Select}
                                        size="sm"
                                        className="answer"
                                        options={jobTitleOption}
                                        value={getValueSelect(element.jobTitle)}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">
                                          ?????a ch???
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        className="answer"
                                        style={{ maxHeight: "38px" }}
                                        value={element.address}
                                      />
                                    </InputGroup>
                                  </div>
                                  <div className="col-12">
                                    <InputGroup size="sm" className="mb-2">
                                      <InputGroup.Prepend
                                        style={{ maxHeight: "38px" }}
                                      >
                                        <InputGroup.Text className="title-cv">
                                          K???t qu???
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        as={Select}
                                        size="sm"
                                        className="answer"
                                        options={resultOption}
                                        value={getValueSelect(element.result)}
                                      />
                                    </InputGroup>
                                  </div>
                                </div>
                                <hr style={{ border: "1px solid blue" }} />
                              </>
                            );
                          })}
                          <div className="row ">
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">T???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  type="month"
                                  value={formatMonthInput(newProcess.from)}
                                  disabled={
                                    newWork.process.length > 0 ||
                                    userInformation.workExperience?.length > 0
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      from: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">?????n</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  type="month"
                                  value={formatMonthInput(newProcess.to)}
                                  disabled={
                                    newProcess.from === "" ||
                                    newProcess.isCurrent
                                      ? true
                                      : false
                                  }
                                  min={newProcess.from}
                                  max={formatMonthInput(new Date())}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      to: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="my-2"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Hi???n t???i"
                                  checked={newProcess.isCurrent}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      isCurrent: e.target.checked,
                                      to: e.target.checked ? "" : newProcess.to,
                                    });
                                  }}
                                />
                              </Form.Group>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">C??ng vi???c</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  value={newProcess.workDescription}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      workDescription: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">
                                    Chuy??n ngh??nh
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="answer"
                                  options={majors}
                                  value={getValueSelect(newProcess.major)}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      major: e.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">
                                    Ch???c danh c??ng vi???c
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="answer"
                                  options={jobTitleOption}
                                  value={getValueSelect(newProcess.jobTitle)}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      jobTitle: e.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">?????a ch???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  value={newProcess.address}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      address: e.target.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                            <div className="col-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text className="title-cv">K???t qu???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="answer"
                                  options={resultOption}
                                  value={getValueSelect(newProcess.result)}
                                  onChange={(e) => {
                                    setNewProcess({
                                      ...newProcess,
                                      result: e.value,
                                    });
                                  }}
                                />
                              </InputGroup>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center mt-2">
                            <button
                              className="btn btn-primary"
                              onClick={handleAddProcess}
                            >
                              Th??m qu?? tr??nh l??m vi???c
                            </button>
                          </div>
                        </Card.Body>
                        <Card.Footer>
                          <InputGroup size="sm">
                            <InputGroup.Prepend style={{ maxHeight: "38px" }}>
                              <InputGroup.Text>Ngh??? vi???c</InputGroup.Text>
                            </InputGroup.Prepend>

                            <FormControl
                              as={Select}
                              size="sm"
                              className="answer"
                              options={listLeaving}
                              value={getValueSelect(newWork.leaving)}
                              onChange={(e) => {
                                setNewWork({
                                  ...newWork,
                                  leaving: e.value,
                                });
                              }}
                            ></FormControl>
                          </InputGroup>
                        </Card.Footer>
                      </Card>
                      {/* button primary d??i 80% ??? gi???a */}
                      <div className="d-flex justify-content-center mt-2">
                        <button
                          className="btn btn-primary"
                          style={{ width: "80%" }}
                          onClick={handleAddWorkExperience}
                        >
                          Th??m c??ng vi???c
                        </button>
                      </div>
                    </Form>
                  </Tab>
                  <Tab eventKey="notwork" title="Th??m th???i gian kh??ng l??m vi???c">
                    <Form className="mt-2" action="javascript:void(0);">
                      <Card border="primary">
                        <Card.Body>
                          <div className="row">
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text>T???</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  type="month"
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  value={formatMonthInput(newNotWork.start)}
                                  onChange={(e) => {
                                    setNewNotWork({
                                      ...newNotWork,
                                      start: e.target.value,
                                    });
                                  }}
                                  disabled={
                                    userInformation.workExperience?.length > 0
                                      ? true
                                      : false
                                  }
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend
                                  style={{ maxHeight: "38px" }}
                                >
                                  <InputGroup.Text>?????n</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  type="month"
                                  className="answer"
                                  style={{ maxHeight: "38px" }}
                                  value={formatMonthInput(newNotWork.end)}
                                  onChange={(e) => {
                                    setNewNotWork({
                                      ...newNotWork,
                                      end: e.target.value,
                                    });
                                  }}
                                  disabled={
                                    newNotWork.isCurrent ||
                                    newNotWork.start === ""
                                  }
                                />
                              </InputGroup>
                            </div>
                            <div className="col-md-4 col-sm-12">
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="my-2"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Hi???n t???i"
                                  checked={newNotWork.isCurrent}
                                  onChange={(e) => {
                                    setNewNotWork({
                                      ...newNotWork,
                                      isCurrent: e.target.checked,
                                      end: e.target.checked
                                        ? ""
                                        : newNotWork.end,
                                    });
                                  }}
                                  disabled={newNotWork.start === ""}
                                  min={newNotWork.start}
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center mt-2">
                            <button
                              className="btn btn-primary"
                              onClick={handleAddNotWork}
                            >
                              Th??m th???i gian kh??ng l??m vi???c
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Tab>
                </Tabs>

                <Accordion>
                  <Card border="primary">
                    <Card.Header className="d-flex w-100 py-1">
                      <Nav.Item className="mr-auto h4 fw" as={Nav.Item}>
                        Ti??u ch?? v?? k???t qu??? ????nh gi??
                      </Nav.Item>
                      <Nav.Item
                        className="align-self-center"
                        style={{ width: "50px" }}
                      >
                        ??i???m
                      </Nav.Item>
                    </Card.Header>
                  </Card>
                  {questions.map((question, index) => {
                    return (
                      <Card border="primary">
                        <Card.Header className="d-flex w-100 py-1">
                          <Accordion.Toggle
                            as={Nav.Link}
                            eventKey={index + 1}
                            className="mr-auto"
                          >
                            {index + 1 + ". " + question.name}{" "}
                            <i className="fa fa-question-circle ms-0"></i>
                          </Accordion.Toggle>
                          <Form.Control
                            className="align-self-center mr-0"
                            // value={userInformation?.pointList[index]}
                            style={{ width: "50px" }}
                            onChange={(e) => {
                              if (isNaN(e.target.value)) e.target.value = 0;
                              if (e.target.value > 10) e.target.value = 10;
                              let pointList = userInformation.pointList;
                              pointList[index] = e.target.value;
                              setUserInformation({
                                ...userInformation,
                                pointList: pointList,
                              });
                            }}
                            type="number"
                            min="0"
                            max="10"
                          ></Form.Control>
                        </Card.Header>
                        <Accordion.Collapse eventKey={index + 1}>
                          <Card.Body className="border-top">
                            {question.detail.map((item, index2) => {
                              return (
                                <>
                                  <Nav.Item>{item}</Nav.Item>
                                </>
                              );
                            })}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    );
                  })}
                </Accordion>
                {/* button b??n ph???i */}
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdatePoint}
                  >
                    L??u
                  </button>
                </div>
              </div>
              <div id="education_bx" className="job-bx bg-white m-b30">
                <div className="d-flex">
                  <h5 className="m-b15">Qu?? tr??nh h???c t???p</h5>
                  <Link
                    to={"#"}
                    onClick={() => setEducation(true)}
                    className="site-button add-btn button-sm"
                  >
                    <i className="fa fa-pencil m-r5"></i> Th??m
                  </Link>
                </div>

                <Modal
                  className="modal fade modal-bx-info editor"
                  show={education}
                  onHide={setEducation}
                >
                  <div className="modal-dialog my-0" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title"
                          id="EducationModalLongTitle"
                        >
                          Qu?? tr??nh h???c t???p
                        </h5>
                        <button
                          type="button"
                          className="close"
                          onClick={() => setEducation(false)}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>T???</label>
                                <input
                                  type="month"
                                  className="form-control"
                                  onChange={(e) => {
                                    setNewSchool({
                                      ...newSchool,
                                      start: e.target.value,
                                    });
                                  }}
                                  required
                                ></input>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>?????n</label>
                                <input
                                  type="month"
                                  className="form-control"
                                  onChange={(e) => {
                                    setNewSchool({
                                      ...newSchool,
                                      end: e.target.value,
                                    });
                                  }}
                                ></input>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>C???p b???c</label>
                                <Select
                                  placeholder="Ch???n c???p b???c"
                                  onChange={(e) =>
                                    setNewSchool((prev) => ({
                                      ...prev,
                                      level: e.value,
                                    }))
                                  }
                                  options={levels}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Tr?????ng</label>
                                <Select
                                  placeholder="Ch???n tr?????ng"
                                  onChange={(e) =>
                                    setNewSchool((prev) => ({
                                      ...prev,
                                      school: e.label,
                                    }))
                                  }
                                  options={schools}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Chuy??n ngh??nh</label>
                                <Select
                                  placeholder="Ch???n chuy??n ngh??nh"
                                  onChange={(e) =>
                                    setNewSchool((prev) => ({
                                      ...prev,
                                      major: e.value,
                                    }))
                                  }
                                  options={majors}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Ch???c danh chuy??n m??n</label>
                                <input
                                  className="form-control"
                                  required
                                  placeholder="Nh???p ch???c danh chuy??n m??n"
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      jobTitle: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="site-button"
                          onClick={() => setEducation(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="site-button btn"
                          disabled={
                            !newSchool.school ||
                            !newSchool.level ||
                            !newSchool.major ||
                            !newSchool.jobTitle
                          }
                          onClick={handleAddSchool}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="clearfix m-b20">
                      {/* badge time */}
                      <div className="badge-time">
                        <span className="badge badge-primary">
                          <i className="fa fa-graduation-cap" />
                          <span>
                            {getMonthYear(userInformation.startYear)} -{" "}
                            {getMonthYear(userInformation.endYear)}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex">
                        <label className="m-b0">{userInformation.school}</label>
                      </div>
                      <p className="m-b0 font-16">
                        C???p b???c: {userInformation.level}
                      </p>
                      <p className="m-b0 font-16">
                        Chuy??n ngh??nh: {userInformation.major}
                      </p>
                    </div>
                    {userInformation.skillEducation?.map((item, index) => {
                      return (
                        <>
                          <hr />
                          <div className="clearfix m-b20">
                            <div className="badge-time">
                              <span className="badge badge-primary">
                                <i className="fa fa-graduation-cap" />
                                <span>
                                  {getMonthYear(item.start)} -{" "}
                                  {getMonthYear(item.end)}
                                </span>
                              </span>
                            </div>
                            <div className="d-flex">
                              <label className="m-b0">{item.school}</label>
                              <Link
                                to={"#"}
                                onClick={() => handleDeleteSchool(item._id)}
                                className="site-button add-btn button-sm"
                                style={{ backgroundColor: "red" }}
                              >
                                <i className="ti-trash m-r5"></i>
                              </Link>
                            </div>
                            <p className="m-b0 font-16">
                              C???p b???c: {item.level}
                            </p>
                            <p className="m-b0 font-16">
                              Chuy??n ngh??nh: {item.major}
                            </p>
                            <p className="m-b0 font-16">
                              Ch???c danh: {item.jobTitle}
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                id="it_skills_bx"
                className="job-bx table-job-bx bg-white m-b30"
              >
                <div className="d-flex">
                  <h5 className="m-b15">Kh??a ????o t???o ng???n h???n</h5>
                  <Link
                    to={"#"}
                    onClick={() => setShowShortTraining(true)}
                    className="site-button add-btn button-sm"
                  >
                    <i className="fa fa-pencil m-r5"></i> Th??m
                  </Link>
                </div>
                <p>
                  Mention your employment details including your current and
                  previous company work experience
                </p>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    {userInformation.shortTraining?.map((item, index) => {
                      return (
                        <>
                          <div className="clearfix m-b20">
                            <div className="badge-time">
                              <span className="badge badge-primary">
                                <i className="fa fa-graduation-cap" />
                                <span>
                                  {getMonthYear(item.start)} -{" "}
                                  {getMonthYear(item.end)}
                                </span>
                              </span>
                            </div>
                            <div className="d-flex">
                              <label className="m-b0">{item.certificate}</label>
                              <Link
                                to={"#"}
                                onClick={() =>
                                  handleDeleteShortTraining(item._id)
                                }
                                className="site-button add-btn button-sm"
                                style={{ backgroundColor: "red" }}
                              >
                                <i className="ti-trash m-r5"></i>
                              </Link>
                            </div>
                            <p className="m-b0 font-16">
                              ????n v??? t??? ch???c: {item.organizer}
                            </p>
                          </div>
                          <hr />
                        </>
                      );
                    })}
                  </div>
                </div>
                <Modal
                  className="modal fade modal-bx-info editor"
                  show={showShortTraining}
                  onHide={setShowShortTraining}
                >
                  <div className="modal-dialog my-0" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Kh??a ????o t???o ng???n h???n</h5>
                        <button
                          type="button"
                          className="close"
                          onClick={() => setItSkills(false)}
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form
                          id="addShortTraining"
                          onSubmit={handleAddShortTraining}
                          action="javascript:void(0);"
                        >
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>T???</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={newShortTraining.start}
                                  onChange={(e) => {
                                    setNewShortTraining({
                                      ...newShortTraining,
                                      start: e.target.value,
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>?????n</label>
                                <Form.Control
                                  type="date"
                                  value={newShortTraining.end}
                                  onChange={(e) => {
                                    setNewShortTraining({
                                      ...newShortTraining,
                                      end: e.target.value,
                                    });
                                  }}
                                  required
                                ></Form.Control>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-6">
                              <div className="form-group">
                                <label>T??n ch???ng ch???</label>
                                <Form.Control
                                  placeholder="Nh???p t??n ch???ng ch???"
                                  value={newShortTraining.certificate}
                                  onChange={(e) => {
                                    setNewShortTraining({
                                      ...newShortTraining,
                                      certificate: e.target.value,
                                    });
                                  }}
                                  required
                                ></Form.Control>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>????n v??? t??? ch???c</label>
                                <input
                                  className="form-control"
                                  placeholder="Nh???p ????n v??? t??? ch???c"
                                  value={newShortTraining.organizer}
                                  onChange={(e) => {
                                    setNewShortTraining({
                                      ...newShortTraining,
                                      organizer: e.target.value,
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="site-button"
                          onClick={() => setShowShortTraining(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="site-button btn"
                          form="addShortTraining"
                          disabled={
                            !newShortTraining.certificate ||
                            !newShortTraining.organizer ||
                            !newShortTraining.start ||
                            !newShortTraining.end
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="job-bx table-job-bx bg-white m-b30">
                <div className="d-flex">
                  <h5 className="m-b15">Ch???ng ch??? ngo???i ng???</h5>
                  <Link
                    to={"#"}
                    onClick={() => setShowLanguageCertification(true)}
                    className="site-button add-btn button-sm"
                  >
                    <i className="fa fa-pencil m-r5"></i> Th??m
                  </Link>
                </div>
                <p>
                  Mention your employment details including your current and
                  previous company work experience
                </p>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    {userInformation.shortTraining?.map((item, index) => {
                      return (
                        <>
                          <div className="clearfix m-b20">
                            <div className="badge-time">
                              <span className="badge badge-primary">
                                <i className="fa fa-graduation-cap" />
                                <span>
                                  {getMonthYear(item.start)} -{" "}
                                  {getMonthYear(item.end)}
                                </span>
                              </span>
                            </div>
                            <div className="d-flex">
                              <label className="m-b0">{item.certificate}</label>
                              <Link
                                to={"#"}
                                onClick={() =>
                                  handleDeleteShortTraining(item._id)
                                }
                                className="site-button add-btn button-sm"
                                style={{ backgroundColor: "red" }}
                              >
                                <i className="ti-trash m-r5"></i>
                              </Link>
                            </div>
                            <p className="m-b0 font-16">
                              ????n v??? t??? ch???c: {item.organizer}
                            </p>
                          </div>
                          <hr />
                        </>
                      );
                    })}
                  </div>
                </div>
                <Modal
                  className="modal fade modal-bx-info editor"
                  show={showLanguageCertification}
                  onHide={setShowLanguageCertification}
                >
                  <div className="modal-dialog my-0" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Ch???ng ch??? ngo???i ng???</h5>
                        <button
                          type="button"
                          className="close"
                          onClick={() => setShowLanguageCertification(false)}
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form
                          id="addLanguageCertification"
                          // onSubmit={handleAddShortTraining}
                          action="javascript:void(0);"
                        >
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>T???</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={newLanguageCertificate.startTime}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      startTime: e.target.value,
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>?????n</label>
                                <Form.Control
                                  type="date"
                                  className="form-control"
                                  value={newLanguageCertificate.endTime}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      endTime: e.target.value,
                                    });
                                  }}
                                  required
                                ></Form.Control>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-6">
                              <div className="form-group">
                                <label>Ngo???i ng???</label>
                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="m-0 p-0"
                                  options={languageOption}
                                  value={getValueSelect(
                                    newLanguageCertificate.language
                                  )}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      language: e.value,
                                      name: "",
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-6">
                              <div className="form-group">
                                <label>T??n ch???ng ch???</label>
                                <FormControl
                                  as={Select}
                                  size="sm"
                                  className="m-0 p-0"
                                  options={certificateOption}
                                  value={getValueSelect(
                                    newLanguageCertificate.name
                                  )}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      name: e.value,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>????n v??? t??? ch???c</label>
                                <input
                                  className="form-control"
                                  placeholder="Nh???p ????n v??? t??? ch???c"
                                  value={newLanguageCertificate.organizer}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      organizer: e.target.value,
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>??i???m</label>
                                <input
                                  className="form-control"
                                  placeholder="Nh???p ??i???m"
                                  value={newLanguageCertificate.point}
                                  onChange={(e) => {
                                    setNewLanguageCertificate({
                                      ...newLanguageCertificate,
                                      point: e.target.value,
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="site-button"
                          onClick={() => setShowLanguageCertification(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="site-button btn"
                          form="addLanguageCertification"
                          disabled={
                            newLanguageCertificate.startTime === "" ||
                            newLanguageCertificate.endTime === "" ||
                            newLanguageCertificate.language === "" ||
                            newLanguageCertificate.name === "" ||
                            newLanguageCertificate.organizer === "" ||
                            newLanguageCertificate.point === ""
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        {/* button center */}
        {userInformation?.confirm2?.confirmed !== 1 && (
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group text-center">
                <button
                  type="button"
                  className="site-button"
                  onClick={handleSendOTP}
                >
                  Y??u c???u duy???t h??? s??
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
export default Jobmyresume;
