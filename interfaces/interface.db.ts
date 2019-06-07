export interface DatabaseMetaInfo {
  Field: string, Type: string, Null: string, Key: string, Default: string,
      Extra: string
}

export interface DatabaseUsers {
  uid: string, fname: string, lanme: string, email: string, username: string,
      password: string, country: string, dob: string, sex: string,
      creatdate: string, comments: string
}

export interface QueryData {
  success: boolean, message: string, error: null|string, data: object
}

export interface User {
  firstname: string, lastname: string, username: string, password: string,
      email: string,
}

export interface Analytics {
    cookies_enabled: boolean,
    creation_time: number,
    native_os: string,
    user_agent: string
}

export interface PostsModel {

  id: number,
  title: string,
  subtitle: string,
  body: string,
  author: string,
  created_at: string,
  updated_at: string
}