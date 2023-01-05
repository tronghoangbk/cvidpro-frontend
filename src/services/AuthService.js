import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, logout } from "../store/actions/AuthActions";

const API_URL = "https://cvidpro.herokuapp.com/";
// const API_URL = "http://localhost:3030/";

export function employeeSignUp(data) {
  const postData = {
    ...data,
  };
  return axios.post(`${API_URL}employee/register`, postData);
}

export function employeeLogin(username, password) {
  const postData = {
    username,
    password,
  };
  return axios.post(`${API_URL}employee/login`, postData);
}

export function companySignUp(data) {
  const postData = {
    ...data,
  };
  return axios.post(`${API_URL}company/register`, postData);
}

export function companyLogin(username, password) {
  const postData = {
    username,
    password,
  };
  return axios.post(`${API_URL}company/login`, postData);
}

export function formatError(errorResponse) {
  console.log(errorResponse);
  switch (errorResponse) {
    case "EMAIL_EXISTS":
      //return 'Email already exists';
      swal("Oops", "Email already exists", "error");
      break;
    case "PHONE_EXISTS":
      //return 'Phone already exists';
      swal("Oops", "Phone already exists", "error");
      break;
    case "TAXCODE_EXISTS":
      //return 'Taxcode already exists';
      swal("Oops", "Taxcode already exists", "error");
      break;
    case "EMAIL_NOT_FOUND":
      //return 'Email not found';
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "PHONE_NOT_FOUND":
      //return 'Email not found';
      swal("Oops", "Phone not found", "error", { button: "Try Again!" });
      break;
    case "TAXCODE_NOT_FOUND":
      //return 'Taxcode not found';
      swal("Oops", "Taxcode not found", "error", { button: "Try Again!" });
      break;
    case "INVALID_PASSWORD":
      //return 'Invalid Password';
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";
    case "USER_NOT_CONFIRMED":
        return "Tài khoản chưa được xác nhận";
    case "SERVER_ERROR":
      swal("Oops", "Server Error", "error", { button: "Try Again!" });
      break;
    default:
      return "";
  }
}

export function saveTokenInLocalStorage(tokenDetails) {
  tokenDetails.expireDate = new Date(
    new Date().getTime() + tokenDetails.expiresIn * 1000
  );
  localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
  setTimeout(() => {
    dispatch(logout(history));
  }, timer);
}

export function checkAutoLogin(dispatch, history) {
  const tokenDetailsString = localStorage.getItem("userDetails");
  let tokenDetails = "";
  if (!tokenDetailsString) {
    dispatch(logout(history));
    return;
  }

  tokenDetails = JSON.parse(tokenDetailsString);
  let expireDate = new Date(tokenDetails.expireDate);
  let todaysDate = new Date();

  if (todaysDate > expireDate) {
    dispatch(logout(history));
    return;
  }
  dispatch(loginConfirmedAction(tokenDetails));

  const timer = expireDate.getTime() - todaysDate.getTime();
  runLogoutTimer(dispatch, timer, history);
}
