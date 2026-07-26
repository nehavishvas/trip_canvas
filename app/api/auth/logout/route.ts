export async function POST() {
  const response = Response.json({ message: 'Logged out successfully' });
  
  // Clear cookie by setting expired Max-Age
  response.headers.append(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax'
  );

  return response;
}
