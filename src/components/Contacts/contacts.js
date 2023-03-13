const supportsContacts = ('contacts' in navigator && 'ContactsManager' in window);
//https://www.twilio.com/blog/web-contact-picker-api
export default async function TrustedContactPicker() {
    if (supportsContacts) {

        const options = {multiple: true};
        const contacts = await navigator.contacts.select(["name", "tel"], options);
        let contact;
        let foundContacts = []

        if (contacts.length > 0) {
            for (let i = 0; i < contacts.length; i++) {
                contact = contacts[i];
                foundContacts.push(contact)
            }
            return foundContacts
        }
    } else {
        console.log("Contact Picker Not Supported")
    }
}