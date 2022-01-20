// Used directly in a match function to determine if a string is a valid UUID
module.exports.uuid = /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}?$/;

// Used to check that the timestamps we return from the DB are in the correct format for us
module.exports.timestampWithTimeZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(\+|-)\d{2}:(00|30|45)$/;

module.exports.checksum = /^[a-fA-F0-9]{64}$/;
