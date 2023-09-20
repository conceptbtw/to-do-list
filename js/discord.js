const clientId = "1150001233772433429";
const redirectUri = "https://conceptbtw.github.io/to-do-list/";

const loginUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&response_type=token&scope=identify`;

const loginButton = document.querySelector("#discord-login");
const logoutButton = document.querySelector("#discord-logout");

function displayUserData(userName, avatarURL) {
  const userAvatar = document.querySelector(".user-avatar");
  const userNameElement = document.querySelector(".user-name");

  userAvatar.src = avatarURL;
  userNameElement.textContent = userName;
}

function isUserLoggedIn() {
  const accessToken = localStorage.getItem("discordAccessToken");
  return !!accessToken;
}

function updateLoginButtons() {
  if (isUserLoggedIn()) {
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
    document.querySelector(".user-info").style.display = "block";
  } else {
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
    document.querySelector(".user-info").style.display = "none";
  }
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("discordAccessToken");
  updateLoginButtons();
});

async function fetchDiscordUserData(accessToken) {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const userData = await response.json();
    const userName = userData.username;
    const avatarURL = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
    displayUserData(userName, avatarURL);
  }
}

window.onload = updateLoginButtons;

loginButton.addEventListener("click", () => {
  window.location.href = loginUrl;
});

const urlParams = new URLSearchParams(window.location.hash.substr(1));
const accessToken = urlParams.get("access_token");

if (accessToken) {
  localStorage.setItem("discordAccessToken", accessToken);
  updateLoginButtons();
  fetchDiscordUserData(accessToken);
}
