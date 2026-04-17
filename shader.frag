infinite scroll

precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform float iZoom;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    vec2 center = vec2(0.5, 0.58);
    vec2 p = uv - center;
    p.x *= iResolution.x / iResolution.y;

    float d = length(p);
float z = iZoom;
    float a = atan(p.y, p.x);

    float glow = smoothstep(0.0, 1.2, d - z * 0.25);
    glow = pow(glow, 0.8);

    float rays = abs(sin(a * 18.0 + (d - z) * 8.0));
    rays = pow(rays, 8.0);

    float rayMask = rays * smoothstep(0.0, 0.9, d);

    vec3 darkColor = vec3(0.02, 0.00, 0.12);
    vec3 lightColor = vec3(0.95, 0.85, 1.0);
    vec3 sideColor = vec3(0.2, 0.4, 1.0);

    vec3 color = mix(darkColor, lightColor, glow);
    color += sideColor * (1.0 - uv.x) * 0.25;
    color += rayMask * vec3(0.35, 0.3, 0.5);

    float centerDark = 1.0 - smoothstep(0.0, 0.25, d);
    color *= 1.0 - centerDark * 0.8;

    gl_FragColor = vec4(color, 1.0);
}