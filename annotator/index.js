function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}

function safeReplaceRange(s, start, end, substitute, searchString) {
    if (searchString !== s.substring(start, end)) {
        console.log("expecting to find " + searchString + " but found " + s.substring(start, end) + " at range " + start + ":" + end)
        return s;
    }

    return s.substring(0, start) + substitute + s.substring(end);
}

window.addEventListener("load", function () {

    const store = document.getElementById("store")
    const regex = /(<span class="annotation">)(.+?)(<\/span>)/gm;
    const target = document.getElementById("target")

    document.getElementById("use").addEventListener("click", function () {

        const annotations = JSON.parse(store.innerHTML)
        let html = target.innerHTML


        for (let annotation of annotations) {
            let openTag = '<span class="annotation">';
            let closeTag = '</span>';
            html = safeReplaceRange(
                html,
                annotation.start,
                annotation.start + annotation.text.length,
                openTag + annotation.text + closeTag, annotation.text
            )
        }
        target.innerHTML = html;

    })

    document.getElementById("save").addEventListener("click", function () {


        let html = target.innerHTML


        let matches = []

        let match;

        while ((match = regex.exec(html)) !== null) {
            const openTag = match[1]
            const annotationText = match[2]
            const closeTag = match[3]
            const startIndex = match.index
            const endIndex = startIndex + openTag.length + annotationText.length + closeTag.length;
            matches.push({
                start: startIndex,
                end: endIndex,
                text: annotationText

            })

        }

        const replaceRegex = /<span class="annotation">(.+?)<\/span>/gm;
        html = html.replaceAll(replaceRegex, "$1");


        target.innerHTML = html

        store.innerHTML = '';
        store.innerHTML = JSON.stringify(matches, null, 2);

    })

})