<template>
	<v-app>
		<NavBar />
		<v-main class="blue-grey lighten-5">
			<h1 class="font-weight-light mt-6 mb-3 text-center">Project Information</h1>
			<v-card flat class="section">
				<v-card-text class="textContent black--text">
					<strong>MyTale</strong> is part of Duke's <a href="https://www.cs.duke.edu/undergrad/summer_research">CS+ Program</a>. CS+ is a ten week summer program for Duke undergraduates to get involved in computer science research projects with faculty in a fast-paced but supportive community environment.<br>
					MyTale is led by Professor Robert Duvall and graduate student Xiangcheng Shen. The team members are Grace Tian, Vatsal Varma, Lynne Wang, Justin Wu, and David Wu. You can find their contact information down below.
				</v-card-text>
			</v-card>

			<h1 class="font-weight-light mt-6 mb-3 text-center">Project Members</h1>

			<v-card flat class="section">
				<v-list three-line>
					<v-row>
						<v-col
							v-for="({ icon, name, team, email }, i) in members"
							:key="i"
							cols="12"
							md="4">
							<v-list-item>
								<v-list-item-avatar size="60">
									<v-img :src="icon"></v-img>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>{{name}}</v-list-item-title>
									<v-list-item-subtitle>{{team}}</v-list-item-subtitle>
									<v-list-item-subtitle><a :href="'mailto:' + email">{{email}}</a></v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-col>
					</v-row>
				</v-list>
			</v-card>

			<div class="py-10"></div>
		</v-main>
	</v-app>
</template>


<script>
import NavBar from "@/components/homepage/NavBar.vue"

export default {
	title: 'MyTale - Make Your Own Social Stories',

	components: {
		NavBar
	},

	data() {
		return {
			members: [
				{
					icon: require("@/assets/rcd.jpg"),
					name: "Robert Duvall",
					team: "Faculty Lead",
					email: "rcd@cs.duke.edu",
				},
				{
					icon: require("@/assets/Richard.jpg"),
					name: "Xiangcheng Shen",
					team: "Project Manager",
					email: "xiangcheng.shen@duke.edu",
				},
				{
					icon: require("@/assets/Vatsal.jpg"),
					name: "Vatsal Varma",
					team: "Editor Team",
					email: "vatsal.varma@duke.edu",
				},
				{
					icon: require("@/assets/Grace.jpg"),
					name: "Grace Tian",
					team: "Editor Team",
					email: "grace.tian@duke.edu",
				},
				{
					icon: require("@/assets/Justin.jpg"),
					name: "Justin Wu",
					team: "Search Team",
					email: "justin.wu@duke.edu",
				},
				{
					icon: require("@/assets/Lynne.jpg"),
					name: "Lynne Wang",
					team: "Search Team",
					email: "lynne.wang@duke.edu",
				},
				{
					icon: require("@/assets/David.jpg"),
					name: "David Wu",
					team: "Fontend/UI Design",
					email: "ruoyu.wu@duke.edu",
				},
			]

		}
	}
}
</script>


<style scoped>
	.section {
		width: 75%;
		margin: auto;
	}

	.editorSecond {
		text-indent: 83px;
	}

	.textContent {
		font-size: 17px;
		line-height: 1.6em;
	}
</style>