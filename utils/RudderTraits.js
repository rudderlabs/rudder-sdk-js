// Traits class
class RudderTraits {
  constructor() {
    this.address = null;
    this.age = null;
    this.birthday = null;
    this.company = null;
    this.createdat = null;
    this.description = null;
    this.email = null;
    this.firstname = null;
    this.gender = null;
    this.id = null;
    this.lastname = null;
    this.name = null;
    this.phone = null;
    this.title = null;
    this.username = null;
  }

  // Setter methods to aid Builder pattern
  setAddress(address) {
    this.address = address;
    return this;
  }

  setAge(age) {
    this.age = age;
    return this;
  }

  setBirthday(birthday) {
    this.birthday = birthday;
    return this;
  }

  setCompany(company) {
    this.company = company;
    return this;
  }

  setCreatedAt(createAt) {
    this.createdat = createAt;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setFirstname(firstname) {
    this.firstname = firstname;
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setLastname(lastname) {
    this.lastname = lastname;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setPhone(phone) {
    this.phone = phone;
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setUsername(username) {
    this.username = username;
    return this;
  }
}
// Class for Company to be embedded in Traits
class TraitsCompany {
  constructor() {
    this.name = "";
    this.id = "";
    this.industry = "";
  }
}
// Class for Address to be embedded in Traits
class TraitsAddress {
  constructor() {
    this.city = "";
    this.country = "";
    this.postalcode = "";
    this.state = "";
    this.street = "";
  }
}
export { RudderTraits, TraitsCompany, TraitsAddress };
