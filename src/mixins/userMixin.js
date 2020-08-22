export default {
    methods: {
      transformItems(items) {
        if (sessionStorage.getItem("user") === "teacher") {
          items = items.filter(item => item.tags.includes("School") || item.tags.includes("Homework") || item.tags.includes("Friends") || item.tags.includes("Teacher"));
        }
        else if (sessionStorage.getItem("user") === "parent") {
          items = items.filter(item => item.tags.includes("Responsibility") || item.tags.includes("Manners") || item.tags.includes("Behavior") || item.tags.includes("Home") || item.tags.includes("Parent"));
        }
        else if (sessionStorage.getItem("user") === "therapist") {
          items = items.filter(item => item.tags.includes("Behavior") || item.tags.includes("Manners") || item.tags.includes("Socializing") || item.tags.includes("Tragedy") || item.tags.includes("Therapist"));
        }
        if (sessionStorage.getItem("user") !== sessionStorage.getItem("prevUser")) {
          this.storeTags(items);
        }
        return items;
      },
  
      storeTags(items) {
        let allTags = [];
        for (let i = 0; i < items.length; i++) {
          allTags.push(items[i].tags);
        }
        sessionStorage.setItem("tags", allTags);
        sessionStorage.setItem("prevUser", sessionStorage.getItem("user"));
      },
  
      transformTags(items) {
        if (sessionStorage.getItem("tags") !== null) {
          items = items.filter(item => this.includesTag(item.value) === true);
          let arr = sessionStorage.getItem("tags").split(",");
          for (let i = 0; i < items.length; i++) {
            items[i].count = arr.filter(arrItem => arrItem === items[i].value).length;
          }
          for (let i = 0; i < items.length; i++) {
            if (items[i].count === 0) {
              items.splice(i, 1);
            }
          }
        }
        return items;
      },
  
      includesTag(tag) {
        return sessionStorage.getItem("tags").includes(tag);
      },
      
      setUser(userName) {
        sessionStorage.setItem("prevUser", sessionStorage.getItem("user"));
        sessionStorage.setItem("user", userName);
      }
    }
}
  