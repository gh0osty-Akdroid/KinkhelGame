const randomstring = require('randomstring')
const fs = require('fs')

exports.addImage = async (image) => {
    // try {
    //     const location = 'src/storage/uploads'
    //     const filename = Date.now() + randomstring.generate('8')
    //     var data = image.replace(/^data:image\/\w+;base64,/, "")
    //     var fName = `${location}/${filename}.png`
    //     var dbLocation = `uploads/${filename}.png`
    //     fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
    //         responses.serverError(res, err)
    //     })

    //     return dbLocation
    // }
    // catch (err) {
    //     return err.message
    // }

    const location = 'src/storage/uploads'
        const filename = Date.now() + randomstring.generate('8')
        var data = image.replace(/^data:image\/\w+;base64,/, "")
        var fName = `${location}/${filename}.png`
        var dbLocation = `uploads/${filename}.png`
        fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
            responses.serverError(res, err)
        })
}

exports.removeImage = async (url) => {
    var url = `${__dirname}../public/Storage/${url}`
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    })
}