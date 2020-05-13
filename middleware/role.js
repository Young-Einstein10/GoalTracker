import AccessControl from "accesscontrol";

const ac = new AccessControl();

exports.roles = function () {
  ac.grant("basic")
    .readOwn("profile")
    .updateOwn("profile")
    .deleteOwn("profile");

  ac.grant("supervisor").extend("basic").readAny("profile");

  ac.grant("admin")
    .extend("basic")
    .extend("supervisor")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile");
};
