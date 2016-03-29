let topics = {};

export default {

  addTopic(topic) {
    if (!topics[topic]) topics[topic] = [];
  },

  delTopic(topic) {
    if (topics[topic]) {
      topics[topic].forEach(subscriber => {
        subscriber = null;
      });
      delete topics[topic];
    }
  },

  publish(topic, data) {
    if (!topics[topic] || topics[topic].length < 1) return;
    topics[topic].forEach(listener => {
      listener(data || {});
    });
  },

  subscribe(topic, listener) {
    if (!topics[topic]) topics[topic] = [];
    let currListener = topics[topic].find((listnr) => listnr === listener);
    if (!currListener) topics[topic].push(listener);
  }
}
