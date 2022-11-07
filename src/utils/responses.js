exports.blankSuccess = (res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: null }))
}

exports.dataSuccess = (res, data) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: null, data: data }))
}

exports.notFoundError = (res, err) => {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: err }))
}

exports.serverError = (res, err) => {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: err }))
}

exports.validatonError = (res, err) => {
    res.writeHead(406, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: err }))
}

exports.unauthorizedError = (res, err) => {
    res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: err }))
}

exports.forbiddenError = (res, err) => {
    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: err }))
}

exports.dataAccepted = (res) => {
    res.writeHead(202, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ error: null }))
}