<template>
  <div class="create-post">
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ this.errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            @change="fileChange"
            accept=".png, .jpg, ,jpeg"
          />
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <vue-editor
          :editorOptions="editorSettings"
          v-model="blogHTML"
          useCustomImageHandler
          @image-added="ImageHandler"
        />
      </div>
      <div class="blog-actions">
        <button>Publish Blog</button>
        <router-link class="router-button" to="#">Post Preview</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BlogCoverPreview from "../components/BlogCoverPreview.vue";
import firebase from "firebase/app";
import Quill from "quill";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
  name: "CreatePost",
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },
  components: {
    BlogCoverPreview,
  },
  methods: {
    fileChange() {
      this.file = this.$refs.blogPhoto.files[0];
      const fileName = this.file.name;
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },
    openPreview() {
      this.$store.commit("openPhotoPreview");
    },
    imageHandler(file, Editor, cursorLocation, resetUploader) {
      const storageRef = firebase.storage().ref();
      const docRef = storageRef.child(`document/blogPostPhotos/${file.name}`);
      docRef.put(file).on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        async () => {
            const downloadURL = await docRef.getDownloadURL();
            Editor.insertEmbed(cursorLocation, "image", downloadURL)
            resetUploader();
        }
      );
    },
  },
  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      },
    },
  },
};
</script>

<style scoped>
.create-post {
  position: relative;
  height: 100%;
}
.create-post button {
  margin-top: 0;
}
.create-post .router-button {
  text-decoration: none;
  color: #fff;
}
.create-post label,
.create-post button,
.create-post .router-button {
  transition: 0.5s ease-in-out all;
  align-self: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 20px;
  padding: 12px 24px;
  color: #fff;
  background-color: #303030;
  text-decoration: none;
}
.create-post label:hover,
.create-post button:hover,
.create-post .router-button:hover {
  background-color: rgba(48, 48, 48, 0.7);
}
.create-post .container {
  position: relative;
  height: 100%;
  padding: 10px 25px 60px;
}
.create-post .invisible {
  opacity: 0 !important;
}
.create-post .err-message {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 10px;
  background-color: #303030;
  opacity: 1;
  transition: 0.5s ease all;
}
.create-post .err-message p {
  font-size: 14px;
}
.create-post .err-message span {
  font-weight: 600;
}
.create-post .blog-info {
  display: flex;
  margin-bottom: 32px;
}
.create-post .blog-info input:nth-child(1) {
  min-width: 300px;
}
.create-post .blog-info input {
  transition: 0.5s ease-in-out all;
  padding: 10px 4px;
  border: none;
  border-bottom: 1px solid #303030;
}
.create-post .blog-info input:focus {
  outline: none;
  box-shadow: 0 1px 0 0 #303030;
}
.create-post .blog-info .upload-file {
  flex: 1;
  margin-left: 16px;
  position: relative;
  display: flex;
}
.create-post .blog-info .upload-file input {
  display: none;
}
.create-post .blog-info .upload-file .preview {
  margin-left: 16px;
  text-transform: initial;
}
.create-post .blog-info .upload-file span {
  font-size: 12px;
  margin-left: 16px;
  align-self: center;
}
.create-post .editor {
  height: 60vh;
  display: flex;
  flex-direction: column;
}
.create-post .editor .quillWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.create-post .editor .ql-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
}
.create-post .editor .ql-editor {
  padding: 20px 16px 30px;
}
.create-post .blog-actions {
  margin-top: 32px;
}
.create-post .blog-actions button {
  margin-right: 16px;
}
</style>
