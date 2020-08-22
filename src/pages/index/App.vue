<template>
  <v-app>
  <NavBar />

  <v-content>

    <section id="heading">
      <v-row no-gutters>
        <v-img
          height="700"
          src="@/assets/background.jpg"
        >
          <v-theme-provider dark>
            <v-container fill-height>
              <v-row
                align="center"
                class="black--text mx-auto"
                justify="center"
              >
                <v-col
                  class="black--text text-center"
                  cols="12"
                  tag="h1"
                >
                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'display-1': 'display-2']"
                    class="font-weight-light"
                  >
                    Make Your Own
                  </span>

                  <br>

                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'display-2': 'display-3']"
                    class="font-weight-black"
                  >
                    SOCIAL STORIES
                  </span>

                </v-col>

                <v-btn
                  class="align-self-end"
                  color="black"
                  fab
                  outlined
                  @click="$vuetify.goTo('#features')"
                >
                  <v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section
      id="features"
      class="grey lighten-3"
    >
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-3">MyTale FEATURES</h2>

        <v-responsive
          class="mx-auto mb-12"
          width="56"
        >
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-row>
          <v-col
            v-for="({ icon, title, text, link }, i) in features"
            :key="i"
            cols="12"
            md="4"
          >
            <v-card
              class="py-12 px-4"
              color="grey lighten-5"
              height="320"
              flat
            >
              <v-theme-provider dark>
                <div>
                  <v-btn
                    color="#E65100"
                    x-large
                    fab
                    :href="link"
                  >
                    <v-icon
                      large
                      v-text="icon"
                    ></v-icon>
                  </v-btn>
                </div>
              </v-theme-provider>

              <v-card-title
                class="justify-center font-weight-black text-uppercase"
                v-text="title"
              ></v-card-title>

              <v-card-text
                class="subtitle-1"
                v-text="text"
              >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div class="py-12"></div>
    </section>

    <section id="blog">
      <div class="py-12"></div>

      <v-container>
        <h2 class="display-2 font-weight-bold mb-3 text-uppercase text-center">Top Stories</h2>

        <v-responsive
          class="mx-auto mb-12"
          width="56"
        >
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-row>
          <v-col
            v-for="({ src, text, title, link }, i) in articles"
            :key="i"
            cols="12"
            md="4"
          >
            <v-img
              :src="src"
              class="mb-4"
              height="275"
              max-width="100%"
            ></v-img>

            <h3
              class="font-weight-black mb-4 text-uppercase"
              v-text="title"
            ></h3>

            <div
              class="title font-weight-light mb-5"
              v-text="text"
            ></div>

            <v-btn
              class="ml-n4 font-weight-black"
              text
              :href="publicPath + link"
            >
              Read more
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <div class="py-12"></div>
    </section>

    <section 
      id="social-stories"
      class="grey lighten-4">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-3">What are Social Stories?</h2>

        <v-responsive
          class="mx-auto mb-8"
          width="56"
        >
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-responsive
          class="mx-auto title font-weight-light mb-8"
          max-width="800"
        >
          Social stories were created by Carol Gray in 1991. They are short descriptions of a particular situation, event or activity, which include specific information about what to expect in that situation and why.
          <br><br>Social Stories are essential because they can significantly improve the way children with autism relate to others. They help them learn what to do (and what not to do) when faced with unfamiliar life situations. Specifically, social stories can help autistic individuals develop self-care skills (e.g. how to clean teeth, wash hands or get dressed), social skills (e.g. sharing, asking for help, saying thank you, interrupting) and academic abilities. 
          <br><br>Furthermore, social stories can help others understand the perspective of an autistic person and why they may respond or behave in a particular way. Social stories can also offer guidance on coping with changes to routine or distressing events (e.g. thunderstorms, moving to a new house).
        </v-responsive>

      </v-container>

      <div class="py-12"></div>
    </section>

  </v-content>

  <v-footer
    class="justify-center"
    color="#9E9E9E"
    height="60"
  >
    <div class="title font-weight-light white--text text--lighten-1 text-center">
      &copy; 2020 — MyTale — Duke CS+
    </div>
  </v-footer>

  </v-app>
</template>


<script>

import stateManager from "@/mixins/StateManager.js"
import NavBar from "@/components/homepage/NavBar.vue"


export default {
  name: 'App',
  title: 'MyTale - Make Your Own Social Stories',

  components: {
    NavBar,
  },

  data () {
    return {
      publicPath: process.env.BASE_URL,

      articles: [
          {
            src: require('@/assets/Homework.jpg'),
            title: 'Doing Homework',
            text: 'Learn to reach out for help and help others while doing homework.',
            link: 'compiled/Doing Homework.html',
          },
          {
            src: require('@/assets/Thanks.jpeg'),
            title: 'Saying Thank You',
            text: 'We say "thank you" when someone does something for us, and we can say "thank you" in many places.',
            link: 'compiled/Saying Thank You in School.html',
          },
          {
            src: require('@/assets/Get-Dressed.jpg'),
            title: 'Getting Dressed',
            text: 'Getting dressed is putting on the right clothes so that you are ready for the next part of your day.',
            link: 'compiled/Getting Dressed.html',
          },
        ],
      features: [
        {
          icon: 'mdi-book-search',
          title: 'Explore',
          text: 'From our growing database, search for social stories by name, theme, author, and more',
          link: 'search_app.html',
        },
        {
          icon: 'mdi-account-heart',
          title: 'Personalize',
          text: 'Take one of our story templates and personalize it by adding names, places, and graphics',
          link: 'editor.html',
        },
        {
          icon: 'mdi-pencil-ruler',
          title: 'Create',
          text: 'Create your own story and/or story template and upload it to our database for others to use',
          link: 'editor.html',
        }
      ]
    }
  },

  mixins: [stateManager],

  /*
   * Created and beforeDestroy lifecycle hooks manage the vuex state of the website across multiple pages
   * Required for proper functionality.
   */

  created: function(){
    if(this.storageAvailable("sessionStorage")){
      console.log("SESSION STORAGE EXISTS");

      if(sessionStorage.getItem("storyLocation") != null){
        this.$store.commit("updateDirectory", {searchLocation: sessionStorage.getItem("storyLocation")});
      } else {
        this.$store.commit("updateDirectory", {searchLocation: "/stories/Story Template.twee"});
        sessionStorage.setItem("storyLocation", this.$store.state.storyLocation);
        sessionStorage.setItem("storyContent", "");
      }
    } else {
      console.log("NO SESSION STORAGE");
    }
  },

};
</script>
