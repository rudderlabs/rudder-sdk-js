//Traits class
class RudderTraits {
    constructor() {
      this.rl_address = null;
      this.rl_age = null;
      this.rl_birthday = null;
      this.rl_company = null;
      this.rl_createdat = null;
      this.rl_description = null;
      this.rl_email = null;
      this.rl_firstname = null;
      this.rl_gender = null;
      this.rl_id = null;
      this.rl_lastname = null;
      this.rl_name = null;
      this.rl_phone = null;
      this.rl_title = null;
      this.rl_username = null;
    }
  
    //Setter methods to aid Builder pattern
    setAddress(address) {
      this.rl_address = address;
      return this;
    }
  
    setAge(age) {
      this.rl_age = age;
      return this;
    }
  
    setBirthday(birthday) {
      this.rl_birthday = birthday;
      return this;
    }
  
    setCompany(company) {
      this.rl_company = company;
      return this;
    }
  
    setCreatedAt(createAt) {
      this.rl_createdat = createAt;
      return this;
    }
  
    setDescription(description) {
      this.rl_description = description;
      return this;
    }
  
    setEmail(email) {
      this.rl_email = email;
      return this;
    }
  
    setFirstname(firstname) {
      this.rl_firstname = firstname;
      return this;
    }
  
    setId(id) {
      this.rl_id = id;
      return this;
    }
  
    setLastname(lastname) {
      this.rl_lastname = lastname;
      return this;
    }
  
    setName(name) {
      this.rl_name = name;
      return this;
    }
  
    setPhone(phone) {
      this.rl_phone = phone;
      return this;
    }
  
    setTitle(title) {
      this.rl_title = title;
      return this;
    }
  
    setUsername(username) {
      this.rl_username = username;
      return this;
    }
}
//Class for Company to be embedded in Traits
class TraitsCompany {
    constructor() {
      this.rl_name = "";
      this.rl_id = "";
      this.rl_industry = "";
    }
}
//Class for Address to be embedded in Traits
class TraitsAddress {
    constructor() {
      this.rl_city = "";
      this.rl_country = "";
      this.rl_postalcode = "";
      this.rl_state = "";
      this.rl_street = "";
    }
}
module.exports = {
    RudderTraits: RudderTraits,
    TraitsCompany: TraitsCompany,
    TraitsAddress: TraitsAddress
};