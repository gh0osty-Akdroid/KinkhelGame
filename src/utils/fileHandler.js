const randomstring = require('randomstring')
const fs = require('fs')

exports.addImage = async (image) => {
    const location = 'src/storage/uploads'
    const filename = Date.now() + randomstring.generate('8')
    var data = image.replace(/^data:image\/\w+;base64,/, "")
    // data is image

    var fName = `${location}/${filename}.png`
    var dbLocation = `uploads/${filename}.png`

    fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
        responses.serverError(res, err)
    })

    return dbLocation
}

exports.removeImage = async (url) => {
    var url = `${__dirname}/../storage/${url}`
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    })
}