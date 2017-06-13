/**
 * 提示
 */
module.exports = (title, timeout) => {
    let d = dialog({
        content: title,
        zIndex: 1051
    });

    d.show();

    setTimeout(() => {
        d.close().remove();
    }, timeout || 2000);
};
