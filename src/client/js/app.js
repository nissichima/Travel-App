
//CHANGE CODE




// makes post to back end with city and date
export const makePost = async (url='', data={}) => {
    const resp = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    
    try {
        const response = await resp.json()
        // console.log(response)
        return response
    } catch(error) {
        console.log(`error${error}`)
    }
}