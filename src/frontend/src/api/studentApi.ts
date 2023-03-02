import API from "./api.ts";

export class StudentApi extends API {
  getAllStudents() {
    return this.get("/api/v1/students");
  }

  addNewStudent(student: JSON) {
    return this.post("api/v1/students", student, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  deleteStudent(id: number) {
    return this.delete(`api/v1/students/${id}`);
  }
}
