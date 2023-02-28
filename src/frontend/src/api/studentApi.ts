import API from "./api.ts";

export class StudentApi extends API {
  getAllStudents() {
    return this.get("/api/v1/students");
  }
}
