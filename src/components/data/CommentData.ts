import { API_URL } from "./Fetcher";

export const createComment = async (
  postId: number,
  content: string,
  token: string,
  parentId?: number | null
): Promise<any> => {
  const body: Record<string, unknown> = { post: postId, content };
  if (parentId != null) body.parent_id = parentId;

  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(response.status.toString());
  return response.json();
};

export const deleteComment = async (
  commentId: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error(response.status.toString());
};
