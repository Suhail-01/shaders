precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

uniform vec2 iMouse;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}


void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 m = iMouse / iResolution;
    vec2 p = uv + (m - 0.5) * 0.2;
p.x += noise((uv + m) * 3.0 + vec2(2.0, 1.0) + iTime * 0.2) * 0.2;
p.y += noise((uv + m) * 3.0 + vec2(5.0, 3.0) - iTime * 0.2) * 0.2;

    float n = 0.0;
n += noise(p * 2.0 + iTime * 0.2) * 0.5;
n += noise(p * 4.0 - iTime * 0.1) * 0.25;
n += noise(p * 8.0) * 0.125;

    float y = uv.y + n * 0.3;

    float lines = abs(sin(y * 80.0 + iTime * 10.0));

    float mask = smoothstep(0.2,0.1, lines);

    vec3 color = vec3(mask);

    gl_FragColor = vec4(color, 1.0);
}