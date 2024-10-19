<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: 'Application is loading...',
  },
});
</script>

<template>
  <div class="wrapper">
    <div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div>
    <!-- <svg
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      :width="loadingSize"
      :height="loadingSize"
      stroke="#fd6947"
    >
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="3">
          <circle stroke-opacity=".50" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg> -->
  </div>
</template>

<style scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1.5rem;
}

.sk-chase {
  width: 50px;
  height: 50px;
  position: relative;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: '';
  display: block;
  width: 25%;
  height: 25%;
  background-color: #fd6947;
  border-radius: 100%;
  animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2) {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}
.sk-chase-dot:nth-child(1):before {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2):before {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3):before {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4):before {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5):before {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6):before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }
  100%,
  0% {
    transform: scale(1);
  }
}
</style>
