import { capabilities } from "./capabilities";
function Member (name, memberTH, opponentTH) {
    this.name = name;
    this.memberTH = memberTH;
    this.opponentTH = opponentTH;
    this.capabilities = capabilities.getArray(memberTH);
}

Member.prototype.editCapability = function(th, stars) {
    this.capabilities[15 - Number(th)] = stars;
}

Member.prototype.resetCapability = function() {
    this.capabilities = capabilities.getArray(this.memberTH);
}

export {Member};